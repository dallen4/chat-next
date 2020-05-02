import { isClient } from 'config';
import { PeerUtils, ConnectionMap } from 'types/peer';
import Peer from 'peerjs';
import { nanoid } from 'nanoid';

export default class PeerClient {
    public peerClient: Peer;
    private connections: ConnectionMap;

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

                this.peerClient.on('connection', (connection: Peer.DataConnection) => {
                    const connectionId = nanoid();

                    connection.on('open', () => {
                        connection.send(`${this.peerClient.id} has joined the chat`);
                        this.connections[connectionId] = {
                            client: connection,
                            messages: [],
                        };
                    });

                    connection.on('data', (data: string) => {
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
