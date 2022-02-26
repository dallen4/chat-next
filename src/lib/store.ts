import localforage from 'localforage';

const USER_META_KEY = 'uchat-id';

export const setUserMeta = async (username: string) => {
    await localforage.setItem(USER_META_KEY, username);
};

export const getUserMeta = () => {
    return localforage.getItem<string>(USER_META_KEY);
};
