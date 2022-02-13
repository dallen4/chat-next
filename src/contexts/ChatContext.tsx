import { generateUsername } from 'lib/util';
import Peer from 'peerjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { PeerClientContext } from './PeerClientContext';

export type ChatStatus = 'connected' | 'disconnected' | 'connecting';

export type ChatInfo = {
    status: ChatStatus;
    connection: Peer.DataConnection;
    messages: any[];
    mediaStream?: MediaStream;
    peerMediaStream?: MediaStream;
    call?: Peer.MediaConnection;
    authenticate: () => Promise<void>;
};

export const ChatContext = createContext<ChatInfo>(null);

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProps> = ({ children }) => {
    const client = useContext(PeerClientContext);
    const [peer, setPeer] = useState<Peer>(null);
    const [username, setUsername] = useState<string>(null);
    const [connection, setConnection] = useState<Peer.DataConnection>();
    const [status, setStatus] = useState<ChatStatus>('disconnected');
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [call, setCall] = useState<Peer.MediaConnection>(null);

    const onData = (data: any) => {
        setMessages((messages) => [...messages, data]);
    };

    const onCall = async (call: Peer.MediaConnection) => {
        if (window.confirm(`${call.peer} is calling, would you like to answer?`)) {
            client.requestMedia(
                (stream: MediaStream) => {
                    call.answer(stream);
                    call.on('stream', setPeerMediaStream);
                    call.on('close', () => alert(`Call with ${call.peer} ended`));
                    setCall(call);
                    setMediaStream(stream);
                },
                (err: any) => {
                    console.error(err);
                    alert('Error occurred');
                    call.close();
                },
            );
        }
    };

    const onConnection = (newConnection: Peer.DataConnection) => {
        newConnection.on('open', () => {
            connection.send(`${peer.id} has joined the chat`);
            setConnection(newConnection);
        });

        newConnection.on('data', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }

    useEffect(() => {
        return () => {
            if (peer) {
                peer.off('connection', setConnection);
                peer.off('call', onCall);

                if (connection) {
                    connection.off('data', onData);
                }

                if (call) {
                    call.close();
                    setCall(null);
                    setMediaStream(null);
                    setPeerMediaStream(null);
                }

                peer.disconnect();
                peer.destroy();
                setPeer(null);
            }
        };
    }, []);

    const authenticate = async () => {
        const username = generateUsername();
        const newPeer = await client.create(username);

        newPeer.on('connection', onConnection);

        newPeer.on('call', onCall);

        setPeer(newPeer);
        setUsername(username);
    };

    return (
        <ChatContext.Provider
            value={{
                status,
                connection,
                messages,
                mediaStream,
                peerMediaStream,
                call,
                authenticate,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export type ChatProps = {
    connectionId: string;
    children: React.ReactNode;
};
