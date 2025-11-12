import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я интеллектуальный AI-ассистент. Чем могу помочь?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('https://functions.poehali.dev/57c35fe1-47d1-41a5-acbb-608b307bad75', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message || 'Извините, произошла ошибка.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, не удалось получить ответ. Попробуйте еще раз.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-4 shadow-2xl">
            <Icon name="Brain" size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            AI Чат-Бот
          </h1>
          <p className="text-lg text-gray-600">
            Интеллектуальный помощник для ответов на ваши вопросы
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 border-white/50 shadow-2xl overflow-hidden animate-slide-up">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-fade-in ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.sender === 'ai'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-orange-500 to-pink-500'
                  }`}
                >
                  {message.sender === 'ai' ? (
                    <Icon name="Sparkles" size={20} className="text-white" />
                  ) : (
                    <Icon name="User" size={20} className="text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[70%] ${
                    message.sender === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block px-5 py-3 rounded-2xl shadow-md ${
                      message.sender === 'ai'
                        ? 'bg-white text-gray-800'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Icon name="Sparkles" size={20} className="text-white" />
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Введите ваше сообщение..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white border-2 border-gray-200 focus:border-purple-400 rounded-2xl px-5 py-6 text-base transition-all"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-2xl px-8 py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Card className="backdrop-blur-xl bg-white/60 border-white/50 p-5 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Быстрые ответы</h3>
            <p className="text-sm text-gray-600">Мгновенная обработка запросов</p>
          </Card>

          <Card className="backdrop-blur-xl bg-white/60 border-white/50 p-5 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3">
              <Icon name="MessageSquare" size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Умный диалог</h3>
            <p className="text-sm text-gray-600">Понимает контекст беседы</p>
          </Card>

          <Card className="backdrop-blur-xl bg-white/60 border-white/50 p-5 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Безопасность</h3>
            <p className="text-sm text-gray-600">Защита ваших данных</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;