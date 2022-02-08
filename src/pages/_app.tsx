import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { initGA, logPageView } from 'lib/google/analytics';
import theme from 'theme';
import { PeerClientProvider } from 'contexts/PeerClientContext';
import PeerClient from 'lib/peer/client';
import OrbitDB from 'orbit-db';
import { initOrbit } from 'lib/db';

function ChatApp({ Component, pageProps }: AppProps) {
    const [peerClient, setPeerClient] = React.useState<PeerClient>(null);
    const [orbit, setOrbit] = React.useState<OrbitDB>(null);
    const [profileDB, setProfileDB] = React.useState<any>(null);

    const router = useRouter();

    React.useEffect(() => {
        initGA();
        logPageView(window.location.pathname);
        router.events.on('routeChangeComplete', logPageView);

        setPeerClient(new PeerClient());

        initOrbit().then(setOrbit).catch(console.error);
    }, []);

    const initProfile = async (username: string) => {
        const newDB = await orbit.keyvalue(username);
        setProfileDB(newDB);
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <CssBaseline />
                    <PeerClientProvider value={peerClient}>
                        <Component {...pageProps} />
                    </PeerClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    );
}

export default ChatApp;
