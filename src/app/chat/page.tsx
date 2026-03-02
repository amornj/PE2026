'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { Send, Trash2, Loader2, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { useChatStore } from '@/store/chatStore';

const SUGGESTED_QUESTIONS = [
  'What are the PE categories in the 2026 guideline?',
  'When should systemic thrombolysis be used?',
  'How does the YEARS algorithm work?',
  'What is the recommended anticoagulation for acute PE?',
];

export default function ChatPage() {
  const { messages, addMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  }, []);

  function handleSpeak(text: string, index: number) {
    if (speakingIndex === index) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const stripped = text.replace(/[#*_`~>\-|]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const utterance = new SpeechSynthesisUtterance(stripped);
    utterance.rate = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setInput('');
    addMessage({ role: 'user', content: trimmed });
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      addMessage({ role: 'assistant', content: data.answer, sources: data.sources });
    } catch {
      addMessage({ role: 'assistant', content: 'Sorry, I couldn\'t get a response. Make sure the NotebookLM proxy is running.' });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendQuestion(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(input);
    }
  }

  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-7rem)] flex-col sm:h-[calc(100dvh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Ask PE Guide</h1>
            <p className="text-xs text-gray-500">Powered by the 2026 AHA/ACC PE Guideline</p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => { stopSpeaking(); clearMessages(); }}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Ask questions about the 2026 AHA/ACC Acute PE Guideline
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Answers are grounded in the full guideline text via NotebookLM
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendQuestion(q)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      msg.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-sm text-white'
                        : 'max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2.5 text-sm text-gray-900'
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {msg.role === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.content, i)}
                        className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-600"
                        aria-label={speakingIndex === i ? 'Stop reading' : 'Read aloud'}
                      >
                        {speakingIndex === i ? (
                          <><Square className="h-3 w-3" /> Stop</>
                        ) : (
                          <><Volume2 className="h-3 w-3" /> Read aloud</>
                        )}
                      </button>
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <details className="mt-2 border-t border-gray-200 pt-2">
                        <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                          {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''}
                        </summary>
                        <div className="mt-1 space-y-1">
                          {msg.sources.map((src, j) => (
                            <div key={j} className="rounded bg-white/60 p-2 text-xs text-gray-600">
                              <p className="font-medium text-gray-700">{src.document_name}</p>
                              <p className="mt-0.5 line-clamp-3">{src.chunk_text}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-3">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the PE guideline..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
