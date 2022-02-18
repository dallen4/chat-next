export enum PeerErrorTypes {
    BrowserIncompatible = 'browser-incompatible',
    Disconnected = 'disconnected',
    InvalidId = 'invalid-id',
    Network = 'network',
    PeerUnavailable = 'peer-unavailable',
    SslUnavailable = 'ssl-unavailable',
    ServerError = 'server-error',
    SocketError = 'socket-error',
    SocketClosed = 'socket-closed',
    UnavailableId = 'unavailable-id',
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
