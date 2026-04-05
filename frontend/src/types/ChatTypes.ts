// types/chatTypes.ts (or just use in the store file)

// Defines a single part of a message (e.g., text)
export interface ChatPart {
  text: string;
}

// Defines a single message turn (user or model)
export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
}

// Defines a single conversation document
export interface Conversation {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

// Defines the data for the sidebar history list
export type ChatHistoryItem = Pick<Conversation, "_id" | "title" | "createdAt">;