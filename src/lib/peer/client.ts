import { isClient } from 'config';
import {
    PeerUtils,
    ConnectionMap,
    ConnectionInstance,
    PeerHanlders,
} from 'types/peer';
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

    async create(id: string) {
        if (isClient) {
            const { initPeer }: PeerUtils = require('.');

            return new Promise<Peer>((resolve, reject) => {
                const peer = initPeer(id);

                resolve(peer);
            });
        }
    }

    async init(id: string, handlers: PeerHanlders) {
        if (isClient) {
            const { initPeer }: PeerUtils = require('.');
            const {
                onNewConnection,
                onMessageReceived,
                onRemoteMediaReceived,
                onLocalMediaStreamStarted,
            } = handlers;

            return new Promise((resolve, reject) => {
                this.peerClient = initPeer(id);

                this.peerClient.on('connection', (connection: Peer.DataConnection) => {
                    connection.on('open', () => {
                        connection.send(`${this.peerClient.id} has joined the chat`);
                        this.connections[connection.peer] = {
                            client: connection,
                            messages: [],
                        };

                        onNewConnection(this.connections[connection.peer]);
                    });

                    connection.on('data', (data) => {
                        const updatedMessages = this.pushMessage(connection.peer, data);
                        onMessageReceived(updatedMessages as any);
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
                                onLocalMediaStreamStarted(stream);
                                call.answer(stream);
                                call.on('stream', onRemoteMediaReceived);
                                call.on('close', () =>
                                    alert(`Call with ${call.peer} ended`),
                                );
                            },
                            (err: any) => {
                                console.error(err);
                                alert('Error occurred');
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
                    resolve(id);
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

    async createConnection(peerId: string, onMessageReceived: any) {
        const client = this.peerClient.connect(peerId);

        this.connections[peerId] = {
            client,
            messages: [],
        };

        client.on('data', (data) => {
            const updatedMessages = this.pushMessage(peerId, data);
            onMessageReceived(updatedMessages);
        });

        return new Promise<ConnectionInstance>((resolve, reject) => {
            client.on('open', () => {
                console.log('connection open with ', peerId);

                client.send(`${this.peerClient.id} has joined the chat`);

                resolve({
                    peerId,
                    ...this.connections[peerId],
                });
            });
        });
    }

    pushMessage = (peerId: string, message: string) => {
        this.connections[peerId].messages.push(message);
        return [...this.connections[peerId].messages];
    };

    sendMessage = (peerId: string, message: string) => {
        this.connections[peerId].client.send(message);
        return this.pushMessage(peerId, message);
    };

    requestMedia = (
        streamHandler: (stream: MediaStream) => any,
        errorHandler: (err: Error) => void,
        audioOnly = false,
    ) => {
        if (this.mediaStream) {
            streamHandler(this.mediaStream);
            return;
        }

        const constraintOptions: MediaStreamConstraints = {
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

        if (audioOnly) constraintOptions.video = false;

        if (navigator.mediaDevices) {
            navigator.mediaDevices
                .getUserMedia(constraintOptions)
                .then(streamHandler)
                .catch(errorHandler);
        }
    };

    callPeer(
        peerId: string,
        onRemoteMediaReceived: (stream: MediaStream) => void,
        onLocalMediaStreamStarted: (stream: MediaStream) => void,
        audioOnly = false,
    ) {
        this.requestMedia(
            (stream: MediaStream) => {
                onLocalMediaStreamStarted(stream);
                const call = this.peerClient.call(peerId, stream);

                call.on('stream', onRemoteMediaReceived);
                call.on('close', () => {
                    delete this.connections[peerId].call;
                });
                call.on('error', console.error);

                this.connections[peerId].call = call;
            },
            (err: any) => {
                console.error(err);
                alert('call failed');
            },
            audioOnly,
        );
    }

    endCall(peerId: string, onCallEnded?: () => void) {
        if (this.connections[peerId].call) this.connections[peerId].call.close();

        if (this.mediaStream) {
            const tracks = this.mediaStream.getTracks();

            const stoppedTracks = tracks.map((track) => {
                track.stop();
                return true;
            });

            if (stoppedTracks.length === tracks.length) this.mediaStream = null;
        }

        if (onCallEnded) onCallEnded();
    }
}
