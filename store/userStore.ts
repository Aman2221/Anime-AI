// store/userStore.ts
import { create } from "zustand";

// user store interface
interface User {
    name: string;
    email: string;
    password: string;
    createdAt: string | Date;
    uuid: string;
    imgURL?: string;
}

// user store dispatch states
interface UserStore {
    user: User | null;
    setUserToStore: (user: User) => void;
    clearUser: () => void;
}

// chat session store interface
interface chatSession {
    chatSessionName: string;
    chatSessionId: string;
    chatSessionCreatedAt: string | Date;
}

// chat session store dispatch states
interface ChatStore {
    chatSession: chatSession | null;
    setChatSessionStore: (chatSession: chatSession) => void;
    clearChatStore: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUserToStore: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));

export const activeSession = create<ChatStore>((set) => ({
    chatSession: null,
    setChatSessionStore: (chatSession) => set({ chatSession }),
    clearChatStore: () => set({ chatSession: null }),
}));

export default useUserStore;
