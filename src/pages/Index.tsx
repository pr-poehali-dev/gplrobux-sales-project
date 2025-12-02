import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    author: "player123",
    rating: 5,
    text: "Быстро и надежно! Робуксы пришли через 5 дней, всё как обещали. Рекомендую!",
    date: "2024-11-28"
  },
  {
    id: "2",
    author: "gamer_pro",
    rating: 5,
    text: "Отличный сервис, никаких проблем. Цены адекватные, поддержка отвечает быстро.",
    date: "2024-11-25"
  },
  {
    id: "3",
    author: "roblox_fan",
    rating: 3,
    text: "Робуксы получил, но пришлось подождать немного дольше обещанного. В целом норм.",
    date: "2024-11-20"
  },
  {
    id: "4",
    author: "noob2024",
    rating: 2,
    text: "Долго ждал, поддержка отвечала не сразу. Робуксы пришли, но ожидал быстрее.",
    date: "2024-11-18"
  }
];

const Index = () => {
  const [nickname, setNickname] = useState("");
  const [robuxAmount, setRobuxAmount] = useState("");
  const [rubleAmount, setRubleAmount] = useState("");
  const [avatar, setAvatar] = useState("");
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  const ROBUX_RATE = 0.9;

  const extractUsername = (input: string) => {
    const atIndex = input.indexOf('@');
    if (atIndex === -1) return input;
    const afterAt = input.substring(atIndex + 1);
    return afterAt.length >= 8 ? afterAt : input;
  };

  const fetchRobloxAvatar = async (username: string) => {
    try {
      const userResponse = await fetch(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=1`);
      const userData = await userResponse.json();
      
      if (userData.data && userData.data.length > 0) {
        const userId = userData.data[0].id;
        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
        const avatarData = await avatarResponse.json();
        
        if (avatarData.data && avatarData.data.length > 0) {
          setAvatar(avatarData.data[0].imageUrl);
        }
      }
    } catch (error) {
      console.error("Failed to fetch avatar:", error);
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    const username = extractUsername(value);
    if (username.length >= 3) {
      fetchRobloxAvatar(username);
    } else {
      setAvatar("");
    }
  };

  const handleRobuxChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setRobuxAmount(value);
    setRubleAmount((numValue * ROBUX_RATE).toFixed(2));
  };

  const handleRubleChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setRubleAmount(value);
    setRobuxAmount(Math.floor(numValue / ROBUX_RATE).toString());
  };

  const handlePayment = (method: string) => {
    if (!nickname || !robuxAmount) {
      toast.error("Заполните все поля!");
      return;
    }
    toast.success(`Переход к оплате через ${method}...`);
  };

  const handleAddReview = () => {
    if (!newReview.trim()) {
      toast.error("Напишите текст отзыва!");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      author: "Аноним",
      rating: newRating,
      text: newReview,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview("");
    setNewRating(5);
    toast.success("Отзыв добавлен!");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? "Star" : "Star"}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#221F2C] to-[#1A1F2C]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 pt-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-6xl font-bold neon-glow text-transparent bg-clip-text gradient-primary inline-block">
              GPLrobux
            </h1>
            <img 
              src="https://cdn.poehali.dev/projects/c85524be-226f-4271-a0a4-12e0693c6bc7/files/0aff01a0-4878-4ea8-8e14-1ef0be92cdcc.jpg" 
              alt="Sammy Developer"
              className="w-16 h-16 animate-float"
            />
          </div>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Быстрая и надежная покупка Robux для вашего аккаунта
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="neon-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl neon-glow">Преимущества</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="Zap" className="text-purple-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">Быстрая доставка</h3>
                  <p className="text-muted-foreground">Получите робуксы за 5-7 дней</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Shield" className="text-blue-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">Безопасность</h3>
                  <p className="text-muted-foreground">Полная защита вашего аккаунта</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="DollarSign" className="text-green-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">Выгодные цены</h3>
                  <p className="text-muted-foreground">1 робукс = 0.90₽</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Headphones" className="text-pink-400 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">Поддержка 24/7</h3>
                  <p className="text-muted-foreground">Всегда на связи для помощи</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl neon-glow">Калькулятор</CardTitle>
              <CardDescription>Рассчитайте стоимость робуксов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Игровой ник (минимум 8 символов после @)</label>
                <Input
                  placeholder="@yourname или yourname"
                  value={nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  className="bg-input border-purple-500/30 focus:border-purple-500"
                />
                {avatar && (
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar className="w-16 h-16 border-2 border-purple-500">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>RX</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">Аватар найден</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Робуксы</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={robuxAmount}
                    onChange={(e) => handleRobuxChange(e.target.value)}
                    className="bg-input border-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Рубли</label>
                  <Input
                    type="number"
                    placeholder="900"
                    value={rubleAmount}
                    onChange={(e) => handleRubleChange(e.target.value)}
                    className="bg-input border-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => handlePayment("ЮКасса")}
                  className="w-full gradient-primary hover:opacity-90 transition-opacity text-white font-semibold h-12"
                >
                  <Icon name="CreditCard" className="mr-2" />
                  Оплатить через ЮКассу
                </Button>
                <Button
                  onClick={() => handlePayment("Перевод")}
                  className="w-full gradient-primary hover:opacity-90 transition-opacity text-white font-semibold h-12"
                >
                  <Icon name="ArrowRightLeft" className="mr-2" />
                  Оплатить переводом
                </Button>
                <Button
                  onClick={() => handlePayment("Сбербанк")}
                  className="w-full gradient-primary hover:opacity-90 transition-opacity text-white font-semibold h-12"
                >
                  <Icon name="Landmark" className="mr-2" />
                  Оплатить через Сбербанк
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="neon-border bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-3xl neon-glow flex items-center gap-2">
              <Icon name="MessageSquare" size={32} />
              Отзывы игроков
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              Рейтинг: 4.6 <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border border-purple-500/30 rounded-lg p-4 bg-background/30">
              <h3 className="font-semibold mb-3">Оставить отзыв</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Icon
                          name="Star"
                          size={24}
                          className={star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Напишите ваш отзыв..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="bg-input border-purple-500/30 focus:border-purple-500"
                  rows={3}
                />
                <Button
                  onClick={handleAddReview}
                  className="gradient-primary hover:opacity-90 transition-opacity text-white font-semibold"
                >
                  <Icon name="Send" className="mr-2" size={16} />
                  Отправить отзыв
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-purple-500/20 rounded-lg p-4 bg-background/20 hover:bg-background/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{review.author[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex gap-1">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-muted-foreground py-8">
          <p>© 2024 GPLrobux. Быстрая доставка робуксов для вашей игры.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
