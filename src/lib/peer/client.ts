import { isClient } from 'config';
import { PeerUtils, ConnectionMap, ConnectionInstance, PeerHanlders, Message } from 'types/peer';
import Peer from 'peerjs';

export default class PeerClient {
    public peerClient: Peer;
    private connections: ConnectionMap;
    private mediaStream: MediaStream;

    constructor() {
        this.peerClient = null;
        this.connections = {};
        this.mediaStream = null;
    }

    async init(handlers: PeerHanlders) {
        if (isClient) {
            const { initPeer }: PeerUtils = require('.');
            const {
                onNewConnection,
                onMessageReceived,
                onRemoteMediaReceived,
            } = handlers;

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

                    connection.on('data', data => {
                        this.connections[connection.peer].messages.push(data);
                        onMessageReceived([...this.connections[connection.peer].messages] as any);
                    });
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
                                call.on('stream', onRemoteMediaReceived);
                            },
                            (err: MediaStream) => {
                                console.error(err);
                                call.close();
                            },
                        );
                    }
                });

                this.peerClient.on('error', (error) => {
                    console.error(error);
                    alert('Error occurred');
                });

                this.peerClient.on('disconnected', () => {
                    this.peerClient.reconnect();
                });

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

    pushMessage = (peerId: string, message: Message) => {
        this.connections[peerId].messages.push(message);
        return [...this.connections[peerId].messages];
    };

    sendMessage = (peerId: string, message: Message) => {
        this.connections[peerId].client.send(message);
        return this.pushMessage(peerId, message);
    };

    requestMedia = (streamHandler: any, errorHandler: any) => {
        const contraintOptions: MediaStreamConstraints = {
            video: {
                facingMode: 'user',
                width: {
                    ideal: 4096,
                },
                height: {
                    ideal: 2160,
                },
            },
            audio: true,
        };

        if (
            typeof navigator.mediaDevices === 'undefined' ||
            typeof navigator.mediaDevices.getUserMedia === 'undefined'
        ) {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            navigator.getUserMedia(contraintOptions, streamHandler, errorHandler);
        } else {
            navigator.mediaDevices
                .getUserMedia(contraintOptions)
                .then(streamHandler)
                .catch(errorHandler);
        }
    };

    callPeer(peerId: string, onRemoteMediaReceived: any) {
        this.requestMedia(
            (stream: MediaStream) => {
                const call = this.peerClient.call(peerId, stream);
                call.on('stream', onRemoteMediaReceived);
            },
            (err: MediaStream) => {
                console.error(err);
                alert('call failed');
            },
        );
    }
}
