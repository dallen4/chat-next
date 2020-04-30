import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import App, { AppProps } from 'next/app';
import Router from 'next/router';
import { SnackbarProvider } from 'notistack';
import { initGA, logPageView } from 'lib/google/analytics';
import theme from 'theme';
import { PeerClientProvider } from 'contexts/PeerClientContext';
import PeerClient from 'lib/peer/client';

export default class CustomApp extends App<any, any, { peerClient: PeerClient }> {
    constructor(props: AppProps) {
        super(props);

        const peerClient = new PeerClient();

        this.state = {
            peerClient,
        };

    }

    componentDidMount() {
        if (!window.GA_ANALYTICS && process.env.NODE_ENV === 'production') {
            initGA();
            window.GA_ANALYTICS = true;
            logPageView(window.location.pathname);
            Router.events.on('routeChangeComplete', logPageView);
        }
    }

    initPeerClient = () => {
        const peerClient = new PeerClient();
        this.setState({ peerClient });
        return peerClient;
    };

    render() {
        const { Component, pageProps } = this.props;
        const { peerClient } = this.state;

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
}
