import React from 'react';
import { useChat } from 'contexts/ChatContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MessageBox from 'molecules/MessageBox';
import Box from '@material-ui/core/Box';
import ReactPlayer from 'react-player';
import IconButton from '@material-ui/core/IconButton';
import PhoneHangup from 'mdi-material-ui/PhoneHangup';
import MessageList from 'molecules/MessageList';
import { useMessages } from 'contexts/MessagesContext';
import { MediaViewMode } from 'types/core';

const useStyles = makeStyles((theme) =>
    createStyles({
        mainContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
            height: `calc(100vh - 64px)`,
        },
        messagesListContainer: {
            overflow: 'scroll',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        white: {
            color: 'white',
        },
    }),
);

const MediaView = ({ mode }: MediaViewProps) => {
    const classes = useStyles();
    const { peerMediaStream, status } = useChat();
    const { messages } = useMessages();

    return (
        <main className={classes.mainContainer}>
            {peerMediaStream === null && mode === 'Chat' ? (
                <>
                    <MessageList messages={messages} />
                    <MessageBox disabled={status !== 'connected'} />
                </>
            ) : peerMediaStream !== null && mode === 'Video' ? (
                <Box flex={1} height={'100%'}>
                    <ReactPlayer
                        width={'100%'}
                        height={'85%'}
                        controls
                        url={peerMediaStream}
                        playing={true}
                    />
                    <Box
                        height={'15%'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <IconButton
                            onClick={() => {
                                alert('Not implemented yet');
                            }}
                            style={{ backgroundColor: 'red' }}
                        >
                            <PhoneHangup className={classes.white} />
                        </IconButton>
                    </Box>
                </Box>
            ) : null}
        </main>
    );
};

export type MediaViewProps = {
    mode: MediaViewMode;
    setMode: (mode: MediaViewMode) => void;
};

export default MediaView;
