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
