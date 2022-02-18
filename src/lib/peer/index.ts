import { PeerErrorType, PeerErrorTypes } from 'lib/constants';
import Peer from 'peerjs';

export const initPeer = (id: string) => new Peer(id, {
    // host: 'localhost',
    // key: 'chat-next',
    // port: 3000,
    // path: '/api/connect',
    // secure: false,
});

export const getMediaStream = async (audioOnly = false): Promise<MediaStream> => {
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

    const stream = await navigator.mediaDevices.getUserMedia(constraintOptions);

    return stream;
};

const handleError = <T extends { type: PeerErrorType}>(err: T) => {
    let message = 'Error occurred, connections may be unstable';

    switch (err.type) {
        case PeerErrorTypes.BrowserIncompatible:
            message = 'Your browser does not support WebRTC';
            break;
        case PeerErrorTypes.Disconnected:
            message = 'You have disconnnected from the network';
            break;
    }

    return;
};
