import { useEffect, useState } from 'react';
import { assistantApi } from '../../../api';

const LeafiaPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Xin chào! Mình là Leafia 🌿 - trợ lý AI của GreenGrass. Bạn muốn tìm sự kiện xanh hay hỏi về cách tích điểm?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const { data } = await assistantApi.getRecommendations();
        setRecommendations(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setRecommendations([]);
      }
    };
    void loadRecommendations();
  }, []);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const history = nextMessages.slice(-8).map((item) => ({
        role: item.role === 'user' ? 'user' : 'model',
        text: item.text,
      }));

      const { data } = await assistantApi.chat({
        message: trimmed,
        history,
      });

      const responseText =
        data?.data?.response ||
        data?.response ||
        'Mình chưa thể phản hồi lúc này, bạn thử lại giúp mình nhé.';

      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      // Friendly error message when backend fails
      const errorText =
        err?.response?.data?.message ||
        'Xin lỗi bạn nha 😅 Hiện tại Leafia đang nhận quá nhiều câu hỏi và hơi bận một chút. Bạn hãy đợi tí rồi nhắn lại giúp mình nhé! 🌱✨';
      setMessages((prev) => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 rounded-3xl bg-surface-highest p-6 shadow-[0_20px_60px_rgba(33,26,20,0.08)]">
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">Leafia AI 🌿</h1>
          <p className="mt-2 text-ink/75">
            Trợ lý môi trường thân thiện giúp bạn tìm hoạt động xanh và hiểu cách dùng nền tảng.
          </p>

          <div className="mt-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink/70">Gợi ý nhanh</h2>
            {recommendations.length === 0 && (
              <p className="text-sm text-ink/60">Đang tải gợi ý...</p>
            )}
            {recommendations.map((item, idx) => (
              <button
                key={`${idx}-${item}`}
                type="button"
                onClick={() => sendMessage(item)}
                className="w-full rounded-xl bg-surface-low px-4 py-3 text-left text-sm text-ink hover:bg-surface transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-8 rounded-3xl bg-surface-highest shadow-[0_20px_60px_rgba(33,26,20,0.08)] flex flex-col min-h-[70vh]">
          <div className="border-b border-ink/10 px-6 py-4">
            <p className="text-sm font-semibold text-primary">Chat with Leafia 🌱</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-surface-low text-ink'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-surface-low text-ink">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="border-t border-ink/10 p-4"
          >
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi Leafia về sự kiện, phân loại rác, điểm thưởng..."
                className="flex-1 rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-ink placeholder:text-ink/50 outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                Gửi
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LeafiaPage;
