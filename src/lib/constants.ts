/**
 * ref: https://peerjs.com/docs.html#peeron-error
 */

export enum PeerErrorTypes {
    /** The client's browser does not support some or all WebRTC features that you are trying to use. */
    BrowserIncompatible = 'browser-incompatible',

    /** You've already disconnected this peer from the server and can no longer make any new connections on it. */
    Disconnected = 'disconnected',

    /** The ID passed into the Peer constructor contains illegal characters. */
    InvalidId = 'invalid-id',

    /** Lost or cannot establish a connection to the signalling server. */
    Network = 'network',

    /** The peer you're trying to connect to does not exist. */
    PeerUnavailable = 'peer-unavailable',

    /** PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer. */
    SslUnavailable = 'ssl-unavailable',

    /** Unable to reach the server. */
    ServerError = 'server-error',

    /** An error from the underlying socket. */
    SocketError = 'socket-error',

    /** The underlying socket closed unexpectedly. */
    SocketClosed = 'socket-closed',

    /** The ID passed into the Peer constructor is already taken. */
    UnavailableId = 'unavailable-id',

    /** Native WebRTC errors. */
    WebRtc = 'webrtc',
}

export type PeerErrorType =
    | 'browser-incompatible'
    | 'disconnected'
    | 'invalid-id'
    | 'network'
    | 'peer-unavailable'
    | 'ssl-unavailable'
    | 'server-error'
    | 'socket-error'
    | 'socket-closed'
    | 'unavailable-id'
    | 'webrtc';
