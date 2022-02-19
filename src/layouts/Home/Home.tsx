import React from 'react';
import {
    AppBar,
    List,
    Toolbar,
    Box,
    Button,
    Typography,
    IconButton,
    CircularProgress,
    ButtonGroup,
} from '@material-ui/core';
import { Video, Chat, PhoneHangup } from 'mdi-material-ui';
import ReactPlayer from 'react-player';
import useStyles from './styles';
import { MediaViewMode } from 'types/core';
import { useChat } from 'contexts/ChatContext';
import MessageBox from 'molecules/MessageBox';
import MessageItem from 'atoms/MessageItem';
import Sidebar from 'molecules/Sidebar';

const Home = () => {
    const classes = useStyles();
    const {
        authenticate,
        isAuthenticated,
        status,
        connection,
        messages,
        peer,
        peerMediaStream,
    } = useChat();

    const [mediaViewMode, setMediaViewMode] = React.useState<MediaViewMode>('Chat');

    const MediaViewSelector = () => (
        <ButtonGroup disableElevation>
            {isAuthenticated && connection && (
                <>
                    <Button
                        onClick={() => setMediaViewMode('Chat')}
                        variant={mediaViewMode === 'Chat' ? 'contained' : null}
                    >
                        <Chat className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Video')}
                        disabled={!peerMediaStream}
                        variant={mediaViewMode === 'Video' ? 'contained' : null}
                    >
                        <Video className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Both')}
                        disabled={!peerMediaStream}
                        variant={mediaViewMode === 'Both' ? 'contained' : null}
                    >
                        <Typography className={classes.bothButtonText}>Both</Typography>
                    </Button>
                </>
            )}
        </ButtonGroup>
    );

    const MediaView = () => (
        <main className={classes.mainContainer}>
            {peerMediaStream === null ? (
                <>
                    <List className={classes.messagesListContainer}>
                        {messages.map((message) => (
                            <MessageItem message={message} />
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

    return (
        <div className={classes.root}>
            <Sidebar />
            <AppBar color={'secondary'} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <MediaViewSelector />
                    <div>
                        {isAuthenticated ? (
                            <Typography>ID: {peer.id}</Typography>
                        ) : (
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                style={{ color: 'white', width: '180px', height: '36px' }}
                                onClick={authenticate}
                            >
                                {status === 'connecting' ? (
                                    <CircularProgress color={'inherit'} size={'14px'} />
                                ) : (
                                    'Continue as Guest'
                                )}
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <div className={classes.content}>
                <div className={classes.toolbarSpacer} />
                <MediaView />
            </div>
        </div>
    );
};

export default Home;
