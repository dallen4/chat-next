import React, { useContext } from 'react';
import {
    AppBar,
    Drawer,
    List,
    ListItem,
    makeStyles,
    Theme,
    createStyles,
    Toolbar,
    Box,
    TextField,
    Button,
    Typography,
    LinearProgress,
    IconButton,
    useTheme,
    CircularProgress,
    ButtonGroup,
} from '@material-ui/core';
import { PeerClientContext } from 'contexts/PeerClientContext';
import { Plus, Phone, Video, Chat, PhoneHangup } from 'mdi-material-ui';
import clsx from 'clsx';
import { ConnectionInstance, PeerStatus } from 'types/peer';
import ReactPlayer from 'react-player';
import StatusIndicator from 'atoms/StatusIndicator';

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: theme.palette.secondary.main,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            width: `calc(100% - ${drawerWidth}px)`,
            height: '100vh',
            maxHeight: '100vh',
            flexGrow: 1,
            backgroundColor: theme.palette.secondary.main,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        mainContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.secondary.main,
        },
        messagesListContainer: {
            overflow: 'scroll',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        messageBox: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.light,
        },
        drawerToolbarContent: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            color: 'white',
        },
        white: {
            color: 'white',
        },
        primary: {
            color: theme.palette.primary.main,
        },
        mediaToggleIcons: {
            fontSize: '1.1rem',
            color: theme.palette.primary.main,
        },
    }),
);

export default () => {
    const classes = useStyles();

    const theme = useTheme();

    const peerClient = useContext(PeerClientContext);

    const [currentConnection, setCurrentConnection] = React.useState<ConnectionInstance>(
        null,
    );

    const [isLoading, setIsLoading] = React.useState(false);
    const [clientInitialized, setInitialized] = React.useState(false);

    const [peerIdInput, setPeerIdInput] = React.useState('');
    const [messageInput, setMessageInput] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const [remoteMediaStream, setRemoteMediaStream] = React.useState<MediaStream>(null);
    const [localMediaStream, setLocalMediaStreeam] = React.useState<MediaStream>(null);

    const initializeClient = async () => {
        setIsLoading(true);
        await peerClient.init({
            onNewConnection: setCurrentConnection,
            onMessageReceived: setMessages as any,
            onRemoteMediaReceived: setRemoteMediaStream,
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

    const MediaViewSelector = () => (
        <ButtonGroup disableElevation>
            <Button className={classes.primary} style={{ fontSize: '0.9rem' }}>
                Both
            </Button>
            <Button variant={'contained'}>
                <Chat className={classes.mediaToggleIcons} />
            </Button>
            <Button>
                <Video className={classes.mediaToggleIcons} />
            </Button>
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
                                        style={{
                                            color:
                                                peerIdInput.length < 10
                                                    ? theme.palette.secondary.light
                                                    : 'white',
                                        }}
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
                                                true,
                                            )
                                        }
                                    >
                                        <Phone />
                                    </IconButton>
                                    <IconButton
                                        onClick={() =>
                                            peerClient.callPeer(
                                                connection.connectionId,
                                                setRemoteMediaStream,
                                            )
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

    return (
        <div className={classes.root}>
            <Sidebar />
            <AppBar color={'secondary'} className={classes.appBar}>
                <Toolbar
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <MediaViewSelector />
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
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.mainContainer}>
                    {remoteMediaStream === null ? (
                        <>
                            <List className={classes.messagesListContainer}>
                                {messages.map((message, index) => (
                                    <ListItem key={index} style={{ color: 'white' }}>
                                        <Typography variant={'caption'}>
                                            username
                                        </Typography>
                                        <Typography>{message}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                            <Box padding={1} className={classes.messageBox}>
                                <TextField
                                    id={'messageInput'}
                                    name={'messageInput'}
                                    value={messageInput}
                                    onChange={(event) =>
                                        setMessageInput(event.target.value)
                                    }
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
                                    disabled={
                                        !clientInitialized || messageInput.length <= 0
                                    }
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
                                <IconButton style={{ backgroundColor: 'red' }}>
                                    <PhoneHangup className={classes.white} />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </div>
            </main>
        </div>
    );
};
