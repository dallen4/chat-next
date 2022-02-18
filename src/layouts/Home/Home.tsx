import React, { useContext } from 'react';
import {
    AppBar,
    Drawer,
    List,
    ListItem,
    Toolbar,
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    useTheme,
    CircularProgress,
    ButtonGroup,
} from '@material-ui/core';
import { Plus, Phone, Video, Chat, PhoneHangup } from 'mdi-material-ui';
import { PeerStatus } from 'types/peer';
import ReactPlayer from 'react-player';
import StatusIndicator from 'atoms/StatusIndicator';
import useStyles from './styles';
import { MediaViewMode } from 'types/core';
import { useChat } from 'contexts/ChatContext';
import MessageBox from 'molecules/MessageBox';
import MessageItem from 'atoms/MessageItem';

const Home = () => {
    const classes = useStyles();
    const {
        authenticate,
        isAuthenticated,
        status,
        connections,
        connect,
        connection,
        messages,
        peer,
        mediaStream,
        peerMediaStream,
    } = useChat();

    const [peerIdInput, setPeerIdInput] = React.useState('');
    const [mediaViewMode, setMediaViewMode] = React.useState<MediaViewMode>('Chat');

    const startNewConnection = async () => {
        connect(peerIdInput);
        setPeerIdInput('');
    };

    const StatusBar = ({ status }: { status: PeerStatus }) => (
        <Toolbar className={classes.drawerToolbarContent}>
            <Typography variant={'body1'}>
                Status: {status === 'online' ? 'Ready' : 'Offline'}{' '}
                <StatusIndicator status={status} />
            </Typography>
        </Toolbar>
    );

    const Sidebar = () => (
        <Drawer
            variant={'permanent'}
            anchor={'left'}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <div>
                <StatusBar
                    status={
                        // status === 'connected'
                        //     ? 'online'
                        //     : status === 'connecting'
                        //     ? 'pending'
                        //     : 'offline'
                        isAuthenticated ? 'online' : 'offline'
                    }
                />
                <List style={{ color: 'white' }}>
                    {isAuthenticated && (
                        <>
                            <ListItem>
                                <TextField
                                    id={'peerIdInput'}
                                    name={'peerIdInput'}
                                    value={peerIdInput}
                                    onChange={(event) =>
                                        setPeerIdInput(event.target.value)
                                    }
                                    variant={'outlined'}
                                    color={'primary'}
                                    placeholder={'Peer ID'}
                                    disabled={!isAuthenticated}
                                    fullWidth
                                />
                                <IconButton
                                    disabled={peerIdInput.length < 5}
                                    onClick={startNewConnection}
                                >
                                    <Plus
                                        className={
                                            peerIdInput.length < 5
                                                ? classes.white
                                                : classes.activeAddPeer
                                        }
                                    />
                                </IconButton>
                            </ListItem>
                            {connections.map((connection) => (
                                <ListItem>
                                    <Typography>{connection.peer}</Typography>
                                    <IconButton
                                        // onClick={() =>
                                        //     peerClient.callPeer(
                                        //         connection.connectionId,
                                        //         setRemoteMediaStream,
                                        //         setLocalMediaStream,
                                        //         true,
                                        //     )
                                        // }
                                        disabled={Boolean(peerMediaStream)}
                                    >
                                        <Phone />
                                    </IconButton>
                                    <IconButton
                                        // onClick={() =>
                                        //     peerClient.callPeer(
                                        //         connection.connectionId,
                                        //         setRemoteMediaStream,
                                        //         setLocalMediaStream,
                                        //     )
                                        // }
                                        disabled={Boolean(peerMediaStream)}
                                        className={
                                            peerMediaStream && classes.activeCall
                                        }
                                    >
                                        <Video />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </>
                    )}
                </List>
            </div>
            {mediaStream !== null && (
                <ReactPlayer width={'100%'} height={'30%'} style={{}} url={mediaStream} />
            )}
        </Drawer>
    );

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
