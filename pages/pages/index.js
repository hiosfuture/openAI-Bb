
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ 오류 발생!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">💬 GPT 챗봇</h1>
        <div className="h-96 overflow-y-auto border p-2 rounded bg-gray-100">
          {messages.map((msg, idx) => (
            <div key={idx} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-300'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400">답변 생성 중...</div>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
