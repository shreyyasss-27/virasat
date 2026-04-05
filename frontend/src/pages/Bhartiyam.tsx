import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";
import { ChatHistorySidebar } from "@/components/sections/bhartiyam-sidebar";
import { MainChatSection } from "@/components/sections/bhartiyam-chat-section";
import { useNavigate, useParams } from "react-router";

export default function BhartiyamPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        fetchChatHistory,
        clearActiveChat,
        getConversation,
        conversations,
        activeConversation
    } = useChatStore();

    const [isOpen, setIsOpen] = useState(false);

    // ✅ Load chat history on mount
    useEffect(() => {
        fetchChatHistory();
    }, [fetchChatHistory]);

    // ✅ Load chat from URL
    useEffect(() => {
        if (id) {
            getConversation(id);
        } else {
            clearActiveChat();
        }
    }, [id, getConversation, clearActiveChat]);

    // ✅ Open existing chat + update URL
    const openChat = (chatId: string) => {
        navigate(`/bhartiyam/${chatId}`);
        getConversation(chatId);
        setIsOpen(false);
    };

    // ✅ Start a new chat
    const startNewChat = () => {
        clearActiveChat();
        navigate("/bhartiyam");   // Reset URL
        setIsOpen(false);
    };

    return (
        <div className="flex h-[91vh] bg-background overflow-hidden">

            {/* -------- DESKTOP SIDEBAR -------- */}
            <aside className="hidden md:flex w-72 border-r">
                <ChatHistorySidebar
                    currentChatId={activeConversation?._id || ""}
                    history={conversations}
                    onSelectChat={openChat}
                    onStartNewChat={startNewChat}
                />
            </aside>

            {/* -------- MOBILE SIDEBAR -------- */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-72 p-0">
                    <ChatHistorySidebar
                        currentChatId={activeConversation?._id || ""}
                        history={conversations}
                        onSelectChat={openChat}
                        onStartNewChat={startNewChat}
                    />
                </SheetContent>
            </Sheet>

            {/* -------- MAIN CHAT AREA -------- */}
            <main className="flex flex-col flex-1">

                {/* HEADER */}
                <header className="flex items-center h-14 border-b px-4">

                    {/* MOBILE MENU */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu />
                    </Button>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-devanagari">भा</span>
                    </div>

                    <h1 className="ml-2 font-semibold">Bhartiyam AI</h1>
                </header>

                {/* CHAT PAGE */}
                <MainChatSection />

            </main>

        </div>
    );
}
