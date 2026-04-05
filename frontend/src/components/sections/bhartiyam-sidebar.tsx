"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    History,
    MessageCircle,
    Trash2,
    Edit2,
    Search,
    MoreVertical
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useState } from "react";


interface Props {
    currentChatId?: string;
    history: { _id: string; title: string; }[];
    onSelectChat: (id: string) => void;
    onStartNewChat: () => void;
}

export function ChatHistorySidebar({
    currentChatId,
    history,
    onSelectChat,
    onStartNewChat
}: Props) {

    const { deleteChat, renameChat, searchChats } = useChatStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [query, setQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const submitRename = async () => {
        if (editingId && title.trim()) {
            const originalChat = history.find(chat => chat._id === editingId);
            if (originalChat && originalChat.title !== title.trim()) {
                await renameChat(editingId, title);
            }
            setEditingId(null);
        } else {
            setEditingId(null);
        }
    };

    const handleSearch = (value: string) => {
        setQuery(value);
        searchChats(value);
    };

    return (
        <div className="flex flex-col h-full p-4 w-full overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-2">
                <History className="h-5 w-5" />
                <h2 className="font-semibold">Chat History</h2>
            </div>

            {/* SEARCH */}
            <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search chats..."
                    className="pl-8 w-full"
                />
            </div>

            {/* NEW CHAT */}
            <Button variant="secondary" onClick={onStartNewChat} className="mb-3">
                <MessageCircle className="h-4 w-4 mr-2" />
                New Chat
            </Button>

            {/* LIST */}
            <ScrollArea className="flex-1">
                <div className="space-y-1">

                    {history.map(chat => (
                        <div
                            key={chat._id}
                            className={`group flex items-center justify-between p-2 rounded cursor-pointer
                            ${currentChatId === chat._id ? "bg-muted" : "hover:bg-muted/50"}`}
                        >

                            {/* TITLE */}
                            <div
                                onClick={() => onSelectChat(chat._id)}
                                className="flex-1 pr-2 min-w-0" //////////
                            >
                                {editingId === chat._id ? (
                                    <input
                                        autoFocus
                                        className="w-full bg-transparent outline-none border-b"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        onBlur={submitRename}
                                        onKeyDown={e => e.key === "Enter" && submitRename()}
                                    />
                                ) : chat.title}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                                    }}
                                    className="p-1 hover:bg-muted rounded opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>


                                {openMenuId === chat._id && (
                                    <div className="absolute right-0 mt-1 w-32 rounded-md bg-popover border shadow z-50">

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingId(chat._id);
                                                setTitle(chat.title);
                                                setOpenMenuId(null);
                                            }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted"
                                        >
                                            <Edit2 className="h-4 w-4 text-blue-500" />
                                            Rename
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteChat(chat._id);
                                                setOpenMenuId(null);
                                            }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-muted"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </button>

                                    </div>
                                )}
                            </div>

                        </div>
                    ))}

                    {history.length === 0 && (
                        <p className="text-center text-muted-foreground mt-6">No chats yet</p>
                    )}

                </div>
            </ScrollArea>

        </div>
    );
}