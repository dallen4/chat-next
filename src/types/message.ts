
export type MessageType = 'user' | 'system';

export interface Message {
    timestamp: number;
    type: MessageType;
    author: string;
    content: string;
}
