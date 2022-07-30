import axios from 'axios';
import { AuthResponse } from 'types/api';

export const useAuth = () => {
    const signup = async (username: string) => {
        const res = await axios.post<AuthResponse>('/api/signup', {
            username,
        });

        return res.data;
    };

    const signin = async (username: string, userId: string) => {
        const res = await axios.post<AuthResponse>('/api/signin', {
            username,
            userId,
        });

        return res.data;
    };

    const signout = async () => {
        await axios.post('/api/signout');
    }

    const identify = async (username: string) => {
        const res = await axios.post<AuthResponse>('/api/identify', {
            username,
        });

        return res.data.sessionId;
    };

    return {
        signup,
        signin,
        signout,
        identify,
    };
};
