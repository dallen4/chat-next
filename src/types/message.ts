
export type MessageType = 'user' | 'system';

export interface Message {
    id: string;
    timestamp: number;
    type: MessageType;
    author: string;
    content: string;
}
