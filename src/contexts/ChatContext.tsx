import { generateUsername } from 'lib/util';
import Peer from 'peerjs';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Message } from 'types/message';
import { PeerUtils } from 'types/peer';

export type ChatStatus = 'connected' | 'disconnected' | 'connecting';

export type ChatInfo = {
    peer: Peer;
    status: ChatStatus;
    connection: Peer.DataConnection;
    messages: any[];
    startCall: () => Promise<void>;
    mediaStream?: MediaStream;
    peerMediaStream?: MediaStream;
    call?: Peer.MediaConnection;
    authenticate: () => Promise<void>;
    isAuthenticated: boolean;
    connect: (id: string) => Promise<void>;
    sendMessage: (message: any) => Promise<void>;
};

export const ChatContext = createContext<ChatInfo>(null);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProps> = ({ children }) => {
    const peerRef = useRef<Peer>();
    const [username, setUsername] = useState<string>(null);
    const [connection, setConnection] = useState<Peer.DataConnection>();
    const [status, setStatus] = useState<ChatStatus>('disconnected');
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [call, setCall] = useState<Peer.MediaConnection>(null);

    const isAuthenticated = !!username;

    const onData = (data: Message) => {
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
                type: 'system',
                author: 'Bot',
                content: `${peerRef.current.id} has joined the chat`,
            });
            setStatus('connected');
            setConnection(newConnection);
        });

        newConnection.on('data', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        newConnection.on('error', (err) => {
            console.error(err);
        });

        newConnection.on('close', () => {
            setConnection(null);
            setStatus('disconnected');
        });
    }

    useEffect(() => {
        return () => {
            if (peerRef.current) {
                peerRef.current.off('connection', setConnection);
                peerRef.current.off('call', onCall);

                if (connection) {
                    connection.off('data', onData);
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
            alert('Error occurred');
        });

        newPeer.on('disconnected', () => {
            newPeer.reconnect();
        });

        newPeer.on('open', (id: string) => {
            peerRef.current = newPeer;
            setUsername(id);
        });
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
                type: 'user',
                author: username,
                content,
            };

            connection.send(message);

            setMessages((prevMessages) => [...prevMessages, message]);
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

export type ChatProps = {
    children: React.ReactNode;
};
