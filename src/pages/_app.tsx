import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { initGA, logPageView } from 'lib/google/analytics';
import theme from 'theme';
import { PeerClientProvider } from 'contexts/PeerClientContext';
import PeerClient from 'lib/peer/client';
import Head from 'next/head';

function ChatApp({ Component, pageProps }: AppProps) {
    const [peerClient, setPeerClient] = React.useState<PeerClient | null>(null);

    const router = useRouter();

    React.useEffect(() => {
        initGA();
        logPageView(window.location.pathname);
        router.events.on('routeChangeComplete', logPageView);
        setPeerClient(new PeerClient());
    }, []);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />
            </Head>
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
