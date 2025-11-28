"use client";

import axios from "axios";
import { useState } from "../hooks";
import React, { useCallback, useRef, useEffect } from "react";
import { Send, Bot, User, FileText, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

type ChatWindowProps = {
  title?: string;
  placeholder?: string;
  systemMessage?: string;
  availableDocuments?: string[];
};

export function ChatWindow({
  title = "Q&A Assistant",
  placeholder = "Ask a question here...",
  systemMessage = "I'm here to help you understand your documents. Ask me anything!",
  availableDocuments = [],
}: ChatWindowProps) {
  const messages = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: systemMessage,
      timestamp: new Date(),
    },
  ]);
  const inputValue = useState("");
  const isTyping = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.value, scrollToBottom]);

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = useCallback(async () => {
    const trimmedValue = inputValue.value.trim();
    if (!trimmedValue || isTyping.value) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: trimmedValue,
      timestamp: new Date(),
    };

    messages.setValue((prev) => [...prev, userMessage]);
    inputValue.setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    isTyping.setValue(true);

    try {
      const res = await axios.post(
        "/api/chat",
        { query: trimmedValue },
        { timeout: 90000 },
      );
      const data = res.data ?? {};
      const answer = data || "No answer returned.";
      const sources = Array.isArray(data.sources) ? data.sources : undefined;

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        sources,
      };

      messages.setValue((prev) => [...prev, assistantMessage]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Chat API error:", error);
      const errMsg: Message = {
        id: uuidv4(),
        role: "assistant",
        content:
          error?.response?.data?.error ||
          error?.message ||
          "An error occurred while contacting the server.",
        timestamp: new Date(),
      };
      messages.setValue((prev) => [...prev, errMsg]);
    } finally {
      isTyping.setValue(false);
    }
  }, [inputValue, isTyping, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      inputValue.setValue(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    },
    [inputValue],
  );

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {availableDocuments.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {availableDocuments.length} document
            {availableDocuments.length !== 1 ? "s" : ""} available for search
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.value.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}

              <div
                className={`flex flex-col gap-2 max-w-2xl ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
                >
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {message.sources && message.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {message.sources.map((source, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-primary/5 border border-primary/20"
                      >
                        <FileText className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {source}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-xs text-muted-foreground px-2">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.role === "user" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isTyping.value && (
            <div className="flex gap-4 justify-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-start">
            <textarea
              ref={textareaRef}
              value={inputValue.value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all overflow-hidden"
              rows={1}
              style={{ maxHeight: "200px" }}
              disabled={isTyping.value}
            />

            <button
              onClick={() => void handleSendMessage()}
              disabled={!inputValue.value.trim() || isTyping.value}
              className="shrink-0 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
