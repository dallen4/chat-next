import client from 'lib/db/redis';
import { nanoid } from 'nanoid';
import type { NextApiResponse } from 'next';
import { ApiRequest, SignupBody, User } from 'types/api';

export default async function signup(req: ApiRequest<SignupBody>, res: NextApiResponse) {
    if (req.method !== 'POST') throw new Error('Method not allowed');

    const { username } = req.body;

    let users: User[] = await client.get('users').then(JSON.parse);

    if (!users) {
        console.log('No users found, creating empty list');
        await client.set('users', JSON.stringify([]));
        users = await client.get('users').then(JSON.parse);
    }

    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
        res.status(400).json({
            error: 'Username already exists',
        });
        return;
    }

    const user: User = {
        id: nanoid(),
        username,
        friends: [],
    };

    users.push(user);

    console.log(users);

    await client.set('users', JSON.stringify(users));

    const sessionId = nanoid();

    await client.set(`online:${username}`, sessionId);

    await client.set(user.id, JSON.stringify(user));

    res.status(200).json({
        sessionId,
        user,
    });
    return;
}
