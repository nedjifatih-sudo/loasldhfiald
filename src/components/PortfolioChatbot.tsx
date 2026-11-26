import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, RotateCcw, Send, X } from 'lucide-react';

const WEBHOOK_URL = 'https://jkyusuf.app.n8n.cloud/webhook/portfolio-chat';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const SUGGESTED_PROMPTS = [
  'Siapa pemilik portofolio ini?',
  'Apa saja keahlian teknisnya?',
  'Proyek apa yang pernah dikerjakan?',
];

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function extractReplyText(payload: unknown): string | null {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed || null;
  }

  if (Array.isArray(payload) && payload.length > 0) {
    return extractReplyText(payload[0]);
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidateKeys = ['reply', 'output', 'response', 'text', 'message', 'answer'];
    for (const key of candidateKeys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    if (record.data) {
      return extractReplyText(record.data);
    }
  }

  return null;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Halo! Ada yang ingin ditanyakan seputar profil, keahlian, atau pengalaman proyek?',
  timestamp: new Date().toISOString(),
};

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => createSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          chatInput: trimmed,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let replyText: string | null = null;
      let responseTimestamp = new Date().toISOString();

      if (contentType.includes('application/json')) {
        const data = (await response.json()) as Record<string, unknown>;
        replyText = extractReplyText(data);
        if (typeof data?.timestamp === 'string') {
          responseTimestamp = data.timestamp;
        }
      } else {
        const raw = await response.text();
        try {
          const parsed = JSON.parse(raw) as unknown;
          replyText = extractReplyText(parsed);
        } catch {
          replyText = raw.trim() || null;
        }
      }

      if (!replyText) {
        throw new Error('Empty response from chatbot');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: responseTimestamp,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Maaf, koneksi ke asisten sedang bermasalah. Silakan coba beberapa saat lagi.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleResetChat = () => {
    if (isSending) return;
    setSessionId(createSessionId());
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
    inputRef.current?.focus();
  };

  const showSuggestions = messages.length === 1 && !isSending;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {isOpen ? (
        <section
          aria-label="Portfolio Assistant Chat"
          className="w-[calc(100vw-2rem)] sm:w-[380px] h-[min(520px,calc(100vh-5rem))] bg-white border border-neutral-200 rounded-lg shadow-lg flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4 shrink-0">
            <div className="min-w-0">
              <h2 className="font-display text-base font-medium text-neutral-900 truncate">
                Portfolio Assistant
              </h2>
              <p className="text-xs text-neutral-500 truncate">
                Tanya profil, keahlian, atau proyek
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                disabled={isSending}
                aria-label="Reset chat"
                title="Reset chat"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                title="Close chat"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white"
            aria-live="polite"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-emerald-900 text-white'
                        : msg.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-neutral-100 text-neutral-900 border border-neutral-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-neutral-400 tabular-nums">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              );
            })}

            {showSuggestions && (
              <div className="pt-2 flex flex-col items-start gap-2">
                <span className="text-xs text-neutral-500">Contoh pertanyaan:</span>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="text-left text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md px-3 py-2 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {isSending && (
              <div className="flex items-start">
                <div className="bg-neutral-100 border border-neutral-200 text-neutral-500 rounded-lg px-3.5 py-2.5 text-sm">
                  Menulis balasan...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2 shrink-0"
          >
            <label htmlFor="chatbot-input" className="sr-only">
              Tulis pesan untuk chatbot
            </label>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pertanyaan..."
              disabled={isSending}
              className="flex-1 min-w-0 px-3.5 py-2 text-sm text-neutral-900 bg-white border border-neutral-200 rounded-md placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Kirim pesan"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-emerald-900 hover:bg-emerald-800 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open portfolio chat"
          className="inline-flex items-center gap-2.5 h-11 px-4 rounded-md bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-medium shadow-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
        >
          <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Chat</span>
        </button>
      )}
    </div>
  );
}
