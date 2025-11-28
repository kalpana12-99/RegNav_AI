"use client";
import { useState } from "../hooks";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  MessageSquare,
  ChevronRight,
  FileText,
  Bot,
} from "lucide-react";

type HomePageProps = {
  title?: string;
  subtitle?: string;
};

export default function Home({
  title = "RegNav AI",
  subtitle = "Upload regulatory documents and chat with AI to get instant answers",
}: HomePageProps) {
  const router = useRouter();
  const hoveredCard = useState<string | null>(null);

  const handleNavigate = useCallback(
    (destination: "upload" | "chat") => {
      if (destination === "upload") {
        router.push("/document-upload");
      } else if (destination === "chat") {
        router.push("/chat");
      }
    },
    [router],
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleNavigate("upload")}
            onMouseEnter={() => hoveredCard.setValue("upload")}
            onMouseLeave={() => hoveredCard.setValue(null)}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Upload Documents
              </h2>

              <p className="text-muted-foreground mb-6">
                Upload your PDF documents to build a knowledge base. Our system
                will process and index them for intelligent search and Q&A.
              </p>

              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Get started</span>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    hoveredCard.value === "upload"
                      ? "translate-x-1"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-24 h-24 text-primary" />
            </div>
          </button>

          <button
            onClick={() => handleNavigate("chat")}
            onMouseEnter={() => hoveredCard.setValue("chat")}
            onMouseLeave={() => hoveredCard.setValue(null)}
            className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-8 text-left transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="relative z-10">
              <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Chat with Documents
              </h2>

              <p className="text-muted-foreground mb-6">
                Ask questions about your uploaded documents and get accurate,
                context-aware answers powered by AI and vector embeddings.
              </p>

              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Start chatting</span>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    hoveredCard.value === "chat"
                      ? "translate-x-1"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Bot className="w-24 h-24 text-primary" />
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 px-6 py-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">
                Secure & Private
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-muted-foreground">
                Lightning Fast
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
