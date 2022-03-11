import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { initGA, logPageView } from 'lib/google/analytics';
import theme from 'theme';
import Head from 'next/head';
import { ChatProvider } from 'contexts/ChatContext';
import { NextSeo } from 'next-seo';
import { MessagesProvider } from 'contexts/MessagesContext';

function ChatApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    React.useEffect(() => {
        initGA();
        logPageView(window.location.pathname);
        router.events.on('routeChangeComplete', logPageView);
    }, []);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />
            </Head>
            <NextSeo
                title={'uChat'}
                description={
                    'uChat is a peer-to-peer chat application for text, audio, and video.'
                }
                openGraph={{
                    type: 'website',
                    url: 'https://chat.nieky.dev',
                    title: 'uChat',
                    description:
                        'uChat is a peer-to-peer chat application for text, audio, and video.',
                }}
            />
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <CssBaseline />
                    <ChatProvider>
                        <MessagesProvider>
                            <Component {...pageProps} />
                        </MessagesProvider>
                    </ChatProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    );
}

export default ChatApp;
