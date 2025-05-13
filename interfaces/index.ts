export interface promptRes {
    id: string;
    provider: string;
    prompt: string | null;
    response: string;
    chatId?: string
}

export interface newChat {
    chatName: string;
    chatId: string;
    createdAt: string;
}