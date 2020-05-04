import { isClient } from 'config';
import { PeerUtils, ConnectionMap, ConnectionInstance } from 'types/peer';
import Peer from 'peerjs';
import { nanoid } from 'nanoid';

export default class PeerClient {
    public peerClient: Peer;
    private connections: ConnectionMap;
    private mediaStream: MediaStream;

    constructor() {
        this.peerClient = null;
        this.connections = {};
        this.mediaStream = null;
    }

    async init(onNewConnection: any, onMessageReceived: any, onMediaReceived: any) {
        if (isClient) {
            const { initPeer }: PeerUtils = require('.');
            return new Promise((resolve, reject) => {
                this.peerClient = initPeer();

                this.peerClient.on('connection', (connection: Peer.DataConnection) => {
                    connection.on('open', () => {
                        connection.send(`${this.peerClient.id} has joined the chat`);
                        this.connections[connection.peer] = {
                            client: connection,
                            messages: [],
                        };

                        onNewConnection(this.connections[connection.peer]);
                    });

                    connection.on('data', onMessageReceived);
                });

                this.peerClient.on('call', (call) => {
                    if (
                        window.confirm(
                            `${call.peer} is calling, would you like to answer?`,
                        )
                    ) {
                        this.requestMedia(
                            (stream: MediaStream) => {
                                call.answer(stream);
                                call.on('stream', onMediaReceived);
                            },
                            (err: MediaStream) => {
                                console.error(err);
                                call.close();
                            },
                        );
                    }
                });

                this.peerClient.on('error', (error) => console.error(error));

                this.peerClient.on('open', (id: string) => {
                    resolve();
                });
            });
        }
    }

    isInitialized() {
        return this.peerClient !== null;
    }

    getConnections() {
        return Object.entries(this.connections).map(([key, value]) => ({
            connectionId: key,
            ...value,
        }));
    }

    getConnection(connectionId: string) {
        return this.connections[connectionId] || null;
    }

    get id() {
        return this.peerClient ? this.peerClient.id : null;
    }

    async createConnection(peerId: string) {
        const client = this.peerClient.connect(peerId);

        return new Promise<ConnectionInstance>((resolve, reject) => {
            client.on('open', () => {
                console.log('connection open with ', peerId);
                this.connections[peerId] = {
                    client,
                    messages: [],
                };

                client.send(`${this.peerClient.id} has joined the chat`);

                resolve({
                    peerId,
                    ...this.connections[peerId],
                });
            });
        });
    }

    requestMedia = (streamHandler: any, errorHandler: any) => {
        // navigator.getUserMedia =
        //             navigator.getUserMedia ||
        //             navigator.webkitGetUserMedia ||
        //             navigator.mozGetUserMedia;

        if (
            typeof navigator.mediaDevices === 'undefined' ||
            typeof navigator.mediaDevices.getUserMedia === 'undefined'
        ) {
            navigator.getUserMedia(
                {
                    // video: {
                    //     facingMode: 'user',
                    // },
                    audio: true,
                },
                streamHandler,
                errorHandler,
            );
        } else {
            navigator.mediaDevices
                .getUserMedia({
                    // video: {
                    //     facingMode: 'user',
                    // },
                    audio: true,
                })
                .then(streamHandler)
                .catch(errorHandler);
        }
    };

    callPeer(peerId: string, onMediaReceived: any) {
        this.requestMedia(
            (stream: MediaStream) => {
                const call = this.peerClient.call(peerId, stream);
                call.on('stream', onMediaReceived);
            },
            (err: MediaStream) => {
                console.error(err);
                alert('call failed');
            },
        );
    }
}
