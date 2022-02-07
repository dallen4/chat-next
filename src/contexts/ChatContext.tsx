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
};

export const ChatContext = createContext<ChatInfo>(null);

export const ChatProvider: React.FC<ChatProps> = ({ connectionId, children }) => {
    const client = useContext(PeerClientContext);
    const [connection, setConnection] = useState<Peer.DataConnection>();
    const [status, setStatus] = useState<ChatStatus>('disconnected');
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [call, setCall] = useState<Peer.MediaConnection | null>(null);

    useEffect(() => {
        const onData = (data: any) => {
            client.pushMessage(connectionId, data);
        };

        const onCall = async (call: Peer.MediaConnection) => {
            if (
                window.confirm(`${call.peer} is calling, would you like to answer?`)
            ) {
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
        }

        if (connectionId) {
            const activeConnection = client.peerClient.connect(connectionId);
            activeConnection.on('data', onData);

            client.peerClient.on('call', onCall);

            setConnection(activeConnection);
        }

        return () => {
            if (connection) {
                connection.off('data', onData);
                client.peerClient.off('call', onCall);
            }
            if (call) {
                call.close();
                setCall(null);
                setMediaStream(null);
                setPeerMediaStream(null);
            }
        };
    }, [connectionId]);

    return <ChatContext.Provider value={{
        status,
        connection,
        messages,
        mediaStream,
        peerMediaStream,
        call,
    }}>{children}</ChatContext.Provider>;
};

export type ChatProps = {
    connectionId: string;
    children: React.ReactNode;
};
