import { useNotification } from 'hooks/use-notification';
import { PeerErrorType, PeerErrorTypes } from 'lib/constants';
import { exampleMessages } from 'lib/examples';
import { getUserMeta, setUserMeta } from 'lib/store';
import { generateColorSet, generateUsername } from 'lib/util';
import { nanoid } from 'nanoid';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Message } from 'types/message';
import { PeerStatus, PeerUtils } from 'types/peer';

export type ChatStatus = 'connected' | 'disconnected' | 'connecting';

export type ChatInfo = {
    peer: Peer;
    status: ChatStatus;
    connections: DataConnection[];
    connection: DataConnection;
    setCurrentConnectionId: (id: string) => void;
    messages: Message[];
    startCall: () => Promise<void>;
    mediaStream?: MediaStream;
    peerMediaStream?: MediaStream;
    call?: MediaConnection;
    authenticate: () => Promise<void>;
    isAuthenticated: boolean;
    connect: (id: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
};

export const ChatContext = createContext<ChatInfo>(null);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC = ({ children }) => {
    const peerRef = useRef<Peer>();
    const [peerStatus, setPeerStatus] = useState<PeerStatus>('offline');
    const [status, setStatus] = useState<ChatStatus>('disconnected');
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [call, setCall] = useState<MediaConnection>(null);
    const [connections, setConnections] = useState<DataConnection[]>([]);
    const [currentConnectionId, setCurrentConnectionId] = useState<string>(null);

    const connection = useMemo(() => {
        if (currentConnectionId) {
            return connections.find((c) => c.label === currentConnectionId);
        }
        return null;
    }, [connections, currentConnectionId]);

    const { pushErrorMessage } = useNotification();

    const isAuthenticated = peerStatus === 'online';

    const onMessage = (connectionId: string, data: Message) => {
        setMessages((messages) => ({
            ...messages,
            [connectionId]: [...(messages[connectionId] || []), data],
        }));
    };

    const onCall = async (call: MediaConnection) => {
        if (window.confirm(`${call.peer} is calling, would you like to answer?`)) {
            try {
                const stream = await getLocalStream();

                call.answer(stream);
                call.on('stream', setPeerMediaStream);
                call.on('close', () => alert(`Call with ${call.peer} ended`));

                setCall(call);
                setMediaStream(stream);
            } catch (err) {
                console.error(err);
                alert('Error occurred');
                call.close();
            }
        }
    };

    function onConnection(newConnection: DataConnection) {
        newConnection.on('open', () => {
            const successMsg: Message = {
                id: nanoid(),
                timestamp: Date.now(),
                type: 'system',
                author: 'Bot',
                content: `${peerRef.current.id} has joined the chat`,
            };

            newConnection.send(successMsg);

            setStatus('connected');
            setCurrentConnectionId(newConnection.label);
            setMessages((messages) => ({
                ...messages,
                [newConnection.label]: [successMsg],
            }));
            hydrateConnections();
        });

        newConnection.on('data', data => onMessage(newConnection.label, data));

        newConnection.on('error', (err) => {
            console.error(err);
        });

        newConnection.on('close', () => {
            setCurrentConnectionId(null);
            setStatus('disconnected');
            hydrateConnections();
        });
    }

    useEffect(() => {
        // window.onbeforeunload = (e) => {
        //     const event = e || window.event;

        //     if (event) event.returnValue = 'Are you sure you want to leave?';

        //     return 'Are you sure you want to leave?';
        // };

        return () => {
            if (peerRef.current) {
                peerRef.current.off('connection', onConnection);
                peerRef.current.off('call', onCall);

                if (connections.length) {
                    connections.forEach((connection) => {
                        connection.off('data', onMessage);
                        connection.close();
                    });
                }

                if (call) {
                    call.close();
                    setCall(null);
                    setMediaStream(null);
                    setPeerMediaStream(null);
                }

                peerRef.current.disconnect();
                peerRef.current.destroy();
                peerRef.current = null;
            }
        };
    }, []);

    const authenticate = async () => {
        const { initPeer }: PeerUtils = require('../lib/peer');

        const username = generateUsername();

        const newPeer = initPeer(username);

        newPeer.on('connection', onConnection);

        newPeer.on('call', onCall);

        newPeer.on('error', (error) => {
            console.error(error);
            handlePeerError(error);
        });

        newPeer.on('disconnected', () => {
            newPeer.reconnect();
        });

        newPeer.on('open', (id: string) => {
            peerRef.current = newPeer;
            setPeerStatus('online');
            setUserMeta(id);
        });
    };

    const hydrateConnections = () => {
        const connectionList = peerRef.current
            ? Object.entries<[DataConnection]>(peerRef.current.connections)
                  .filter(([, [connection]]) => connection && connection.type === 'data')
                  .map(([, [connection]]) => connection)
            : [];

        setConnections(connectionList);
    };

    const connect = async (id: string) => {
        setStatus('connecting');

        const [color1, color2] = generateColorSet();

        const newConnection = peerRef.current.connect(id, {
            metadata: {
                startTime: Date.now(),
                [peerRef.current.id]: color1,
                [id]: color2,
            },
        });

        onConnection(newConnection);
    };

    const sendMessage = async (content: string) => {
        if (connection) {
            const message: Message = {
                id: nanoid(),
                timestamp: Date.now(),
                type: 'user',
                author: peerRef.current.id,
                content,
            };

            connection.send(message);

            onMessage(currentConnectionId, message);
        }
    };

    const getLocalStream = async () => {
        let stream = mediaStream;

        if (!stream) {
            const { getCameraStream }: PeerUtils = require('../lib/peer');
            stream = await getCameraStream();
        }

        return stream;
    };

    const startCall = async () => {
        if (connection) {
            const stream = await getLocalStream();

            const call = peerRef.current.call(
                connection.peer,
                mediaStream,
            ) as MediaConnection;
            call.on('stream', setPeerMediaStream);
            call.on('close', () => alert(`Call with ${call.peer} ended`));

            setMediaStream(stream);
            setCall(call);
        }
    };

    const handlePeerError = <T extends { type: PeerErrorType }>(err: T) => {
        let message = 'Error occurred, connections may be unstable';
        let retryAction: () => void;

        switch (err.type) {
            case PeerErrorTypes.BrowserIncompatible:
                message = 'Your browser does not support WebRTC';
                break;
            case PeerErrorTypes.Disconnected:
                message = 'You have disconnnected from the network';
                retryAction = peerRef.current && peerRef.current.reconnect;
                break;
        }

        pushErrorMessage(message, retryAction);
    };

    return (
        <ChatContext.Provider
            value={{
                peer: peerRef.current,
                isAuthenticated,
                status,
                connections,
                connection,
                setCurrentConnectionId,
                messages: (currentConnectionId && messages[currentConnectionId]) ? messages[currentConnectionId] : [],
                startCall,
                mediaStream,
                peerMediaStream,
                call,
                authenticate,
                connect,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
