import json
import os
import uuid
import base64
from typing import Dict, Any
from pydantic import BaseModel, Field

class PaymentRequest(BaseModel):
    amount: float = Field(..., gt=0)
    nickname: str = Field(..., min_length=3)
    robux: int = Field(..., gt=0)
    method: str = Field(..., pattern='^(yookassa|sberbank|transfer)$')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create payment for Robux purchase
    Args: event with httpMethod, body; context with request_id
    Returns: Payment URL or instructions
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    payment_req = PaymentRequest(**body_data)
    
    if payment_req.method == 'yookassa':
        return create_yookassa_payment(payment_req, context)
    elif payment_req.method == 'sberbank':
        return create_sberbank_payment(payment_req, context)
    else:
        return create_transfer_payment(payment_req, context)

def create_yookassa_payment(payment_req: PaymentRequest, context: Any) -> Dict[str, Any]:
    import http.client
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID', '')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY', '')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'ЮКасса не настроена. Добавьте ключи в настройках проекта.',
                'needsSetup': True
            }),
            'isBase64Encoded': False
        }
    
    idempotence_key = str(uuid.uuid4())
    
    payment_data = {
        'amount': {
            'value': f'{payment_req.amount:.2f}',
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': 'https://gplrobux.ru/success'
        },
        'capture': True,
        'description': f'Покупка {payment_req.robux} Robux для @{payment_req.nickname}',
        'metadata': {
            'nickname': payment_req.nickname,
            'robux': payment_req.robux
        }
    }
    
    credentials = base64.b64encode(f'{shop_id}:{secret_key}'.encode()).decode()
    
    conn = http.client.HTTPSConnection('api.yookassa.ru')
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Basic {credentials}',
        'Idempotence-Key': idempotence_key
    }
    
    conn.request('POST', '/v3/payments', json.dumps(payment_data), headers)
    response = conn.getresponse()
    response_data = json.loads(response.read().decode())
    conn.close()
    
    if response.status == 200:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'payment_url': response_data['confirmation']['confirmation_url'],
                'payment_id': response_data['id']
            }),
            'isBase64Encoded': False
        }
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Ошибка создания платежа',
                'details': response_data
            }),
            'isBase64Encoded': False
        }

def create_sberbank_payment(payment_req: PaymentRequest, context: Any) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'method': 'sberbank',
            'instructions': f'Переведите {payment_req.amount:.2f}₽ на карту Сбербанка',
            'card_number': '2202 2006 7890 1234',
            'amount': payment_req.amount,
            'comment': f'Робуксы для @{payment_req.nickname}'
        }),
        'isBase64Encoded': False
    }

def create_transfer_payment(payment_req: PaymentRequest, context: Any) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'method': 'transfer',
            'instructions': f'Переведите {payment_req.amount:.2f}₽ любым способом',
            'bank_details': {
                'card': '2202 2006 7890 1234',
                'phone': '+7 900 123-45-67',
                'comment': f'Робуксы @{payment_req.nickname}'
            },
            'amount': payment_req.amount
        }),
        'isBase64Encoded': False
    }
