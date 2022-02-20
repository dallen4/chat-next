import React from 'react';
import { useChat } from 'contexts/ChatContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MessageItem from 'atoms/MessageItem';
import MessageBox from 'molecules/MessageBox';
import Box from '@material-ui/core/Box';
import ReactPlayer from 'react-player';
import IconButton from '@material-ui/core/IconButton';
import PhoneHangup from 'mdi-material-ui/PhoneHangup';

const useStyles = makeStyles((theme) =>
    createStyles({
        mainContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.secondary.main,
            height: `calc(100vh - 64px - 95px)`,
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

const MediaView = () => {
    const classes = useStyles();
    const { messages, peerMediaStream, status } = useChat();

    return (
        <main className={classes.mainContainer}>
            {peerMediaStream === null ? (
                <>
                    <List className={classes.messagesListContainer}>
                        {messages.map((message, index) => (
                            <MessageItem key={index} message={message} />
                        ))}
                    </List>
                    <MessageBox disabled={status !== 'connected'} />
                </>
            ) : (
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
            )}
        </main>
    );
};

export default MediaView;
