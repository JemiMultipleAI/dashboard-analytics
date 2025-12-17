'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
  const chatUrl = process.env.NEXT_PUBLIC_N8N_CHAT_URL;
  
  if (!chatUrl) {
    return (
      <DashboardLayout title="Chat & Webhook">
        <div className="space-y-6 animate-fade-in">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <p className="text-sm">⚠️ Chat URL is not configured. Please set NEXT_PUBLIC_N8N_CHAT_URL in your environment variables.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Chat & Webhook">
      <div className="space-y-6 animate-fade-in">
        {/* Chat Widget Section */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Chat Support</h2>
              <p className="text-sm text-muted-foreground">Get help from our support team</p>
            </div>
          </div>
          <div className="h-[600px] w-full rounded-lg border border-border overflow-hidden">
            <iframe
              src={chatUrl}
              className="h-full w-full"
              title="Chat Widget"
              allow="microphone; camera"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

