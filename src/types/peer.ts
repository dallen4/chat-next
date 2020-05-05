import Peer from 'peerjs';

export interface PeerUtils {
    initPeer: () => Peer;
}

export interface ConnectionInstance {
    peerId?: string;
    client: Peer.DataConnection;
    messages: Array<any>;
}

export interface ConnectionMap {
    [key: string]: ConnectionInstance;
}

export type Message = string;

export interface PeerHanlders {
    onNewConnection: (connection: ConnectionInstance) => void;
    onMessageReceived: (message: Message) => void;
    onRemoteMediaReceived: (stream: MediaStream) => void;
}
