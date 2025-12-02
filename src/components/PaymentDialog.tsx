import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

export const PaymentDialog = ({ open, onOpenChange, data }: PaymentDialogProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-purple-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-glow">Инструкции для оплаты</DialogTitle>
          <DialogDescription>
            {data?.instructions}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-background/30 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Сумма к оплате:</span>
              <span className="text-xl font-bold text-purple-400">{data?.amount}₽</span>
            </div>
          </div>

          {data?.card_number && (
            <div className="bg-background/30 p-4 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Номер карты:</p>
                  <p className="font-mono text-lg">{data.card_number}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(data.card_number.replace(/\s/g, ''))}
                  className="border-purple-500/30"
                >
                  <Icon name="Copy" size={16} />
                </Button>
              </div>
            </div>
          )}

          {data?.bank_details && (
            <>
              <div className="bg-background/30 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Номер карты:</p>
                    <p className="font-mono text-lg">{data.bank_details.card}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(data.bank_details.card.replace(/\s/g, ''))}
                    className="border-purple-500/30"
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
              </div>

              <div className="bg-background/30 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Телефон:</p>
                    <p className="font-mono text-lg">{data.bank_details.phone}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(data.bank_details.phone)}
                    className="border-purple-500/30"
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}

          {(data?.comment || data?.bank_details?.comment) && (
            <div className="bg-background/30 p-4 rounded-lg border border-purple-500/20">
              <p className="text-sm text-muted-foreground mb-1">Комментарий к переводу:</p>
              <p className="font-semibold text-purple-300">{data.comment || data.bank_details.comment}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full gradient-primary hover:opacity-90 transition-opacity text-white font-semibold"
            >
              Понятно
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
