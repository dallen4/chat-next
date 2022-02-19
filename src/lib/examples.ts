import { Message } from 'types/message';

export const exampleMessages: Message[] = [
    {
        timestamp: Date.now(),
        type: 'system',
        author: 'System',
        content: 'Welcome to uChat!',
    },
    {
        timestamp: Date.now(),
        type: 'user',
        author: 'John',
        content: 'Hello!',
    },
    {
        timestamp: Date.now(),
        type: 'user',
        author: 'Jane',
        content: 'what is good today?',
    },
];
