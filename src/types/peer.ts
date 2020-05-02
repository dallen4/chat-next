import Peer from 'peerjs';

export interface PeerUtils {
    initPeer: () => Peer;
}

export interface ConnectionMap {
    [key: string]: {
        client: Peer.DataConnection;
        messages: Array<any>;
    };
};
