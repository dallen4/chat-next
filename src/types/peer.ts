import Peer from 'peerjs';

export interface PeerUtils {
    initPeer: (id: string) => Peer;
    getCameraStream: (audioOnly?: boolean) => Promise<MediaStream>;
}

export interface ConnectionInstance {
    peerId?: string;
    client: Peer.DataConnection;
    messages: Array<any>;
    call?: Peer.MediaConnection;
}

export type PeerStatus = 'offline' | 'error' | 'pending' | 'online';

export interface ConnectionMap {
    [key: string]: ConnectionInstance;
}

export interface PeerHanlders {
    onNewConnection: (connection: ConnectionInstance) => void;
    onMessageReceived: (message: string) => void;
    onRemoteMediaReceived: (stream: MediaStream) => void;
    onLocalMediaStreamStarted: (stream: MediaStream) => void;
}
