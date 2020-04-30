import { createContext } from 'react';
import PeerClient from 'lib/peer/client';

export const PeerClientContext = createContext<PeerClient>(null);

export const PeerClientProvider = PeerClientContext.Provider;

export const PeerClientConsumer = PeerClientContext.Consumer;
