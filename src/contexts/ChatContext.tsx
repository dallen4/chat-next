import { useNotification } from 'hooks/use-notification';
import { getUserMeta, setUserMeta } from 'lib/store';
import { generateUsername } from 'lib/util';
import Peer from 'peerjs';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Message } from 'types/message';
import { PeerUtils } from 'types/peer';

export type ChatStatus = 'connected' | 'disconnected' | 'connecting';

export type ChatInfo = {
    peer: Peer;
    status: ChatStatus;
    connections: Peer.DataConnection[];
    connection: Peer.DataConnection;
    messages: Message[];
    startCall: () => Promise<void>;
    mediaStream?: MediaStream;
    peerMediaStream?: MediaStream;
    call?: Peer.MediaConnection;
    authenticate: () => Promise<void>;
    isAuthenticated: boolean;
    connect: (id: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
};

export const ChatContext = createContext<ChatInfo>(null);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC = ({ children }) => {
    const peerRef = useRef<Peer>();
    const [username, setUsername] = useState<string>(null);
    const [connection, setConnection] = useState<Peer.DataConnection>();
    const [status, setStatus] = useState<ChatStatus>('disconnected');
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [call, setCall] = useState<Peer.MediaConnection>(null);
    const [connections, setConnections] = useState<Peer.DataConnection[]>([]);

    const { pushErrorMessage } = useNotification();

    const isAuthenticated = !!peerRef.current;

    const onMessage = (data: Message) => {
        setMessages((messages) => [...messages, data]);
    };

    const onCall = async (call: Peer.MediaConnection) => {
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

    function onConnection(newConnection: Peer.DataConnection) {
        newConnection.on('open', () => {
            newConnection.send({
                timestamp: Date.now(),
                type: 'system',
                author: 'Bot',
                content: `${peerRef.current.id} has joined the chat`,
            });
            setStatus('connected');
            setConnection(newConnection);
            hydrateConnections();
        });

        newConnection.on('data', onMessage);

        newConnection.on('error', (err) => {
            console.error(err);
        });

        newConnection.on('close', () => {
            setConnection(null);
            setStatus('disconnected');
            hydrateConnections();
        });
    }

    useEffect(() => {
        return () => {
            if (peerRef.current) {
                peerRef.current.off('connection', setConnection);
                peerRef.current.off('call', onCall);

                if (connections.length) {
                    connections.forEach((connection) => {
                        connection.close();
                        connection.off('data', onMessage);
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

        let username = await getUserMeta();

        if (!username) username = generateUsername();

        const newPeer = initPeer(username);

        newPeer.on('connection', onConnection);

        newPeer.on('call', onCall);

        newPeer.on('error', (error) => {
            console.error(error);
            alert('Error occurred');
        });

        newPeer.on('disconnected', () => {
            newPeer.reconnect();
        });

        newPeer.on('open', (id: string) => {
            peerRef.current = newPeer;
            setUsername(id);
            setUserMeta(id);
        });
    };

    const hydrateConnections = () => {
        const connectionList = Object.entries<[Peer.DataConnection]>(
            peerRef.current.connections,
        )
            .filter(([, [connection]]) => connection.type === 'data')
            .map(([, [connection]]) => connection);

        setConnections(connectionList);
    };

    const connect = async (id: string) => {
        setStatus('connecting');

        const newConnection = peerRef.current.connect(id, {
            metadata: {
                username,
            },
        });

        onConnection(newConnection);
    };

    const sendMessage = async (content: string) => {
        if (connection) {
            const message: Message = {
                timestamp: Date.now(),
                type: 'user',
                author: username,
                content,
            };

            connection.send(message);

            onMessage(message);
        }
    };

    const getLocalStream = async () => {
        let stream = mediaStream;

        if (!stream) {
            const { getMediaStream }: PeerUtils = require('../lib/peer');
            stream = await getMediaStream();
        }

        return stream;
    };

    const startCall = async () => {
        if (connection) {
            const stream = await getLocalStream();

            const call = peerRef.current.call(connection.peer, mediaStream);
            call.on('stream', setPeerMediaStream);
            call.on('close', () => alert(`Call with ${call.peer} ended`));

            setMediaStream(stream);
            setCall(call);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                peer: peerRef.current,
                isAuthenticated,
                status,
                connections,
                connection,
                messages,
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
