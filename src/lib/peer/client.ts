import { isClient } from 'config';
import { PeerUtils } from 'types/peer';
import Peer from 'peerjs';

export default class PeerClient {
    public peerClient: Peer;
    private connections: any;

    constructor() {
        this.peerClient = null;
        this.connections = {};
    }

    async init() {
        if (isClient) {
            const { initPeer }: PeerUtils = require('.');
            return new Promise((resolve, reject) => {
                this.peerClient = initPeer();
    
                this.peerClient.on('open', (id: string) => {
                    resolve();
                });

                this.peerClient.on('error', (error) => console.error(error));
    
                this.peerClient.on('connection', (conn: any) => {
                    this.connections[conn.id] = conn;
    
                    conn.on('open', () => {
                        conn.send(`${this.peerClient.id} has joined the chat`);
                    });
    
                    conn.on('data', (data: string) => {
                        console.log('new message: ', data);
                    });
                });
            });

        }
    }

    isInitialized() {
        return this.peerClient !== null;
    }

    get id() {
        return this.peerClient ? this.peerClient.id : null;
    }

    callPeer() {}
}
