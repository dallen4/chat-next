import client from 'lib/db/redis';
import { nanoid } from 'nanoid';
import type { NextApiResponse } from 'next';
import { ApiRequest, AuthResponse, User } from 'types/api';

export default async function signin(
    req: ApiRequest<{ username: string; userId: string }>,
    res: NextApiResponse<AuthResponse>,
) {
    if (req.method !== 'POST') throw new Error('Method not allowed');

    const { username, userId } = req.body;

    const user: User = await client.get(userId).then(JSON.parse);

    const newSessionId = nanoid();

    await client.set(`online:${username}`, newSessionId);

    res.status(200).json({ user, sessionId: newSessionId });
    return;
}
