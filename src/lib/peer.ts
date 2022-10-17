import Peer from 'peerjs';

export const initPeer = (id: string) => {
    const server = new URL(process.env.NEXT_PUBLIC_PEER_SERVER_URL!);

    const peer = new Peer(id, {
        host: server.host,
        path: server.pathname,
        secure: true,
        port: 443,
    });

    return peer;
}

export const getCameraStream = async (audioOnly = false): Promise<MediaStream> => {
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

export const getScreenStream = async (disableAudio = false): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: 'always',
            width: {
                ideal: 4096,
            },
            height: {
                ideal: 2160,
            },
        } as MediaTrackConstraints,
        audio: disableAudio
            ? false
            : {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: 44100,
              },
    });

    return stream;
};
