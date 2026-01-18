'use client';

import { useRef, useEffect } from 'react';
import { useAppChat } from '@/context/ChatContext';
import { Message } from '@/components/Message';
import { Message as MessageType } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function MessageList() {
  const { messages, isLoading } = useAppChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to Mr. SUZUKI</h2>
        <p className="text-muted-foreground max-w-md">
          Ask me anything, and I&apos;ll do my best to help you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-4">
        {messages.map((message: MessageType) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start px-4 md:px-6 lg:px-8 py-4 max-w-screen-md mx-auto">
            <div className="flex gap-3 max-w-[80%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted shadow-sm">
                <BotIcon className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-2 rounded-lg px-4 py-3 text-sm bg-muted border">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// Import this separately to avoid React hydration errors
import { BotIcon } from 'lucide-react';