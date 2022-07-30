import client from 'lib/db/redis';
import type { NextApiResponse } from 'next';
import { ApiRequest, User } from 'types/api';

export default async function users(
    req: ApiRequest<{}>,
    res: NextApiResponse<{ users: User[] }>,
) {
    if (req.method !== 'GET') throw new Error('Method not allowed');

    let users: User[] = await client.get('users').then(JSON.parse);

    if (!users) {
        console.log('No users found, creating empty list');
        await client.set('users', JSON.stringify([]));
        users = await client.get('users').then(JSON.parse);
    }

    res.status(200).json({ users });
    return;
}
