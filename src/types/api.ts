import type { NextApiRequest } from 'next';

export type ApiRequest<T = any> = Omit<NextApiRequest, 'body'> & {
    body: T;
};

export type SignupBody = {
    username: string;
};

export type IdentifyBody = SignupBody;

export type AuthResponse = {
    sessionId: string;
    user: User;
};

export type User = {
    id: string;
    username: string;
    friends: string[];
};
