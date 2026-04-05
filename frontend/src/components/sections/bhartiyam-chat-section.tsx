"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MainChatSection() {
    const { activeConversation, isSendingMessage, sendMessage } = useChatStore();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset input on new chat
    useEffect(() => setInput(""), [activeConversation?._id]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [activeConversation?.messages, isSendingMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSendingMessage) return;
        await sendMessage(input);
        setInput("");
    };

    return (
        <section className="flex flex-col flex-1 relative overflow-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-4">
                <div ref={scrollRef} className="max-w-4xl mx-auto space-y-6">

                    {!activeConversation?.messages?.length && (
                        // <div className="text-center text-muted-foreground mt-24">
                        //     Ask your first question 🚀
                        // </div>
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-2">
                                <h1 className="text-3xl font-bold">Bhartiyam AI Assistant</h1>
                            </div>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                AI chatbot trained exclusively on verified primary literature and authentic cultural resources. Get accurate answers about Hindu sacred texts, traditions, and cultural practices from authoritative sources only.
                            </p>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                Bhartiyam AI Ready - Primary Sources Verified
                            </div>
                        </div>
                    )}


                    {activeConversation?.messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >

                            {/* Avatar */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center
                ${msg.role === "user"
                                        ? "bg-blue-500"
                                        : "bg-gradient-to-r from-orange-500 to-red-500"
                                    }`}
                            >
                                {msg.role === "user" ? (
                                    <User className="h-4 w-4 text-white" />
                                ) : (
                                    <span className="text-white">भा</span>
                                )}
                            </div>

                            <div className="max-w-[75%]">
                                {/* <Badge>{msg.role === "user" ? "You" : "Bhartiyam AI"}</Badge> */}
                                <div className="mt-1 p-3 rounded-lg bg-muted border whitespace-pre-wrap">
                                    <Markdown remarkPlugins={[remarkGfm]}>
                                        {msg.parts?.[0]?.text}
                                    </Markdown>
                                </div>
                            </div>

                        </div>
                    ))}

                    {isSendingMessage && (
                        <div className="text-muted-foreground animate-pulse">
                            Bhartiyam AI is thinking...
                        </div>
                    )}

                </div>
            </ScrollArea>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="sticky bottom-0 border-t bg-background p-4"
            >
                <div className="flex max-w-3xl mx-auto gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        disabled={isSendingMessage}
                    />
                    <Button disabled={!input.trim() || isSendingMessage}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>

        </section>
    );
}
