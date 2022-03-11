import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import localforage from 'localforage';
import unionBy from 'lodash/unionBy';
import { Message } from 'types/message';
import { useChat } from './ChatContext';
import { nanoid } from 'nanoid';

export type MessagesInfo = {
    sendMessage: (content: string) => void;
    messages: Message[];
};

export type MessageMap = {
    [key: string]: Message[];
};

export const MessagesContext = createContext<MessagesInfo>(null);

export const useMessages = () => useContext(MessagesContext);

export const MessagesProvider: React.FC = ({ children }) => {
    const { peer, connection, connections } = useChat();
    const [messageMap, setMessageMap] = useState<MessageMap>({});

    const init = async () => {
        const freshMap = await connections.reduce<Promise<MessageMap>>(
            async (prev, connection) => {
                const prevValue = await prev;

                const prevMessages = messageMap[connection.peer] || [];
                const storedMessages = await localforage.getItem<Message[]>(
                    `messages-${connection.peer}`,
                );

                const mergedMessages = unionBy(prevMessages, storedMessages, 'id').sort(
                    (a, b) => a.timestamp - b.timestamp,
                );

                prevValue[connection.peer] = mergedMessages;

                return { ...prevValue };
            },
            {} as Promise<MessageMap>,
        );

        setMessageMap(freshMap);
    };

    useEffect(() => {
        init();

        connections.forEach((connection) => {
            connection.on('data', (data) => onNewMessage(connection.peer, data));
        });

        return () => {
            connections.forEach((connection) => {
                connection.off('data', (data) => onNewMessage(connection.peer, data));
            });
        };
    }, [connections]);

    const onNewMessage = async (connectionId: string, data: Message) => {
        // store the message via localforage
        const storedMessages = await localforage.getItem<Message[]>(
            `messages-${connectionId}`,
        );

        const mergedMessages = unionBy(
            storedMessages,
            messageMap[connectionId],
            'id',
        ).sort((a, b) => a.timestamp - b.timestamp);

        const newMessages = [...mergedMessages, data];

        await localforage.setItem(`messages-${connectionId}`, newMessages);

        // update the message map
        setMessageMap((messageMap) => ({
            ...messageMap,
            [connectionId]: newMessages,
        }));
    };

    const messages = useMemo(() => {
        const messages = messageMap[connection?.peer] || [];

        return messages;
    }, [messageMap, connection]);

    const sendMessage = (content: string) => {
        if (connection) {
            const message: Message = {
                id: nanoid(),
                timestamp: Date.now(),
                type: 'user',
                author: peer.id,
                content,
            };

            connection.send(message);

            onNewMessage(connection.peer, message);
        }
    };

    return (
        <MessagesContext.Provider value={{ sendMessage, messages }}>
            {children}
        </MessagesContext.Provider>
    );
};
