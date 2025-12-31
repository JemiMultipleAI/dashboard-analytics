"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { fetchSeoChatReply } from "@/lib/api";

type ChatMessage = { sender: "user" | "bot"; text: string };

const initialMessages: ChatMessage[] = [
  { sender: "bot", text: "Hi there! 👋" },
  { sender: "bot", text: "My name is Nathan. How can I assist you today?" },
];

export default function SeoChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = question.trim();
    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setQuestion("");
    try {
      const reply = await fetchSeoChatReply(trimmed);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Something went wrong. Please try again.";
      setError(msg);
      setMessages((prev) => [...prev, { sender: "bot", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="SEO Chat">
      <div className="space-y-6 animate-fade-in">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                SEO Chat
              </h2>
              <p className="text-sm text-muted-foreground">
                Chat with your SEO assistant
              </p>
            </div>
          </div>

          <div className="h-[650px] w-full rounded-lg border border-border overflow-hidden flex flex-col">
            {/* Hero/header similar to Chat */}
            <div className="bg-[#0d102c] text-white p-6">
              <h3 className="text-2xl font-semibold mb-2">Hi there! 👋</h3>
              <p className="text-sm text-white/80">
                Start a chat. We're here to help you 24/7.
              </p>
            </div>

            {/* Conversation area */}
            <div className="flex-1 bg-[#f3f5f9] overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.sender}-${idx}-${msg.text.slice(0, 10)}`}
                  className={cn(
                    "max-w-[80%] lg:max-w-[40%] rounded-lg px-3 py-2 shadow-sm",
                    msg.sender === "bot"
                      ? "bg-white text-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-white text-muted-foreground shadow-sm">
                  Typing...
                </div>
              )}
              {error && (
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-destructive/10 text-destructive shadow-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-white px-4 py-3"
            >
              <div className="relative">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question..."
                  className="pr-12"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  disabled={loading || !question.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
