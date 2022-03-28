import client from 'lib/db/redis';
import type { NextApiResponse } from 'next';
import { ApiRequest, IdentifyBody } from 'types/api';

export default async function identify(req: ApiRequest<IdentifyBody>, res: NextApiResponse) {
    if (req.method !== 'POST') throw new Error('Method not allowed');

    const { username } = req.body;

    const sessionId = await client.get(`online:${username}`);

    if (sessionId) {
        res.status(200).json({
            sessionId,
            username,
        });
        return;
    } else {
        res.status(400).json({
            error: 'User is not online or does not exist',
        });
        return;
    }
}
