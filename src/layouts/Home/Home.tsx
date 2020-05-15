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
import { PeerClientContext } from 'contexts/PeerClientContext';
import { Plus, Phone, Video, Chat, PhoneHangup } from 'mdi-material-ui';
import { ConnectionInstance, PeerStatus } from 'types/peer';
import ReactPlayer from 'react-player';
import StatusIndicator from 'atoms/StatusIndicator';
import useStyles from './styles';
import { MediaViewMode } from 'types/core';

const Home = () => {
    const classes = useStyles();

    const peerClient = useContext(PeerClientContext);

    const [currentConnection, setCurrentConnection] = React.useState<ConnectionInstance>(
        null,
    );

    const [isLoading, setIsLoading] = React.useState(false);
    const [clientInitialized, setInitialized] = React.useState(false);

    const [peerIdInput, setPeerIdInput] = React.useState('');

    const [mediaViewMode, setMediaViewMode] = React.useState<MediaViewMode>('Chat');
    const [messageInput, setMessageInput] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const [remoteMediaStream, setRemoteMediaStream] = React.useState<MediaStream>(null);
    const [localMediaStream, setLocalMediaStream] = React.useState<MediaStream>(null);

    const initializeClient = async () => {
        setIsLoading(true);
        await peerClient.init({
            onNewConnection: setCurrentConnection,
            onMessageReceived: setMessages as any,
            onRemoteMediaReceived: setRemoteMediaStream,
            onLocalMediaStreamStarted: setLocalMediaStream,
        });
        setInitialized(true);
        setIsLoading(false);
    };

    const startNewConnection = async () => {
        const connection = await peerClient.createConnection(peerIdInput, setMessages);
        setCurrentConnection(connection);
        setPeerIdInput('');
    };

    const sendMessage = async () => {
        currentConnection.client.send(messageInput);
        currentConnection.messages.push(messageInput);

        setMessages([...currentConnection.messages]);
        setMessageInput('');
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
                        clientInitialized ? 'online' : isLoading ? 'pending' : 'offline'
                    }
                />
                <List style={{ color: 'white' }}>
                    {clientInitialized && (
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
                                    disabled={!clientInitialized}
                                    fullWidth
                                />
                                <IconButton
                                    disabled={peerIdInput.length < 10}
                                    onClick={startNewConnection}
                                >
                                    <Plus
                                        className={
                                            peerIdInput.length < 10
                                                ? classes.white
                                                : classes.activeAddPeer
                                        }
                                    />
                                </IconButton>
                            </ListItem>
                            {peerClient.getConnections().map((connection) => (
                                <ListItem>
                                    <Typography>{connection.connectionId}</Typography>
                                    <IconButton
                                        onClick={() =>
                                            peerClient.callPeer(
                                                connection.connectionId,
                                                setRemoteMediaStream,
                                                setLocalMediaStream,
                                                true,
                                            )
                                        }
                                        disabled={Boolean(remoteMediaStream)}
                                    >
                                        <Phone />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            peerClient.callPeer(
                                                connection.connectionId,
                                                setRemoteMediaStream,
                                                setLocalMediaStream,
                                            )
                                        }
                                        disabled={Boolean(remoteMediaStream)}
                                        className={
                                            remoteMediaStream && classes.activeCall
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
            <DrawerVideoFeed />
        </Drawer>
    );

    const MediaViewSelector = () => (
        <ButtonGroup disableElevation>
            {clientInitialized && currentConnection && (
                <>
                    <Button
                        onClick={() => setMediaViewMode('Chat')}
                        variant={mediaViewMode === 'Chat' ? 'contained' : null}
                    >
                        <Chat className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Video')}
                        disabled={!remoteMediaStream}
                        variant={mediaViewMode === 'Video' ? 'contained' : null}
                    >
                        <Video className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Both')}
                        disabled={!remoteMediaStream}
                        variant={mediaViewMode === 'Both' ? 'contained' : null}
                    >
                        <Typography className={classes.bothButtonText}>Both</Typography>
                    </Button>
                </>
            )}
        </ButtonGroup>
    );

    const DrawerVideoFeed = () =>
        localMediaStream !== null && (
            <ReactPlayer
                width={'100%'}
                height={'30%'}
                style={{}}
                url={localMediaStream}
            />
        );

    const MediaView = () => (
        <main className={classes.mainContainer}>
            {remoteMediaStream === null ? (
                <>
                    <List className={classes.messagesListContainer}>
                        {messages.map((message, index) => (
                            <ListItem key={index} style={{ color: 'white' }}>
                                <Typography variant={'caption'}>username</Typography>
                                <Typography>{message}</Typography>
                            </ListItem>
                        ))}
                    </List>
                    <Box padding={1} className={classes.messageBox}>
                        <TextField
                            id={'messageInput'}
                            name={'messageInput'}
                            value={messageInput}
                            onChange={(event) => setMessageInput(event.target.value)}
                            multiline
                            rows={2}
                            variant={'outlined'}
                            color={'primary'}
                            placeholder={'Type your words here...'}
                            disabled={!clientInitialized}
                            fullWidth
                            style={{ marginRight: '0.5rem' }}
                        />
                        <Button
                            disabled={!clientInitialized || messageInput.length <= 0}
                            variant={'contained'}
                            color={'primary'}
                            onClick={sendMessage}
                            style={{
                                height: '75px',
                                width: '75px',
                            }}
                        >
                            Send
                        </Button>
                    </Box>
                </>
            ) : (
                <Box flex={1} height={'100%'}>
                    <ReactPlayer
                        width={'100%'}
                        height={'85%'}
                        controls
                        url={remoteMediaStream}
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
                            onClick={() =>
                                peerClient.endCall(currentConnection.peerId, () =>
                                    setRemoteMediaStream(null),
                                )
                            }
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
                        {clientInitialized ? (
                            <Typography>ID: {peerClient.id}</Typography>
                        ) : (
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                style={{ color: 'white', width: '180px', height: '36px' }}
                                onClick={initializeClient}
                            >
                                {isLoading ? (
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
