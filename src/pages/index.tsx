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
} from '@material-ui/core';
import { PeerClientContext } from 'contexts/PeerClientContext';
import { Plus, Phone, Video } from 'mdi-material-ui';
import clsx from 'clsx';
import { ConnectionInstance } from 'types/peer';
import ReactPlayer from 'react-player';

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
            backgroundColor: theme.palette.primary.main,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            width: `calc(100% - ${drawerWidth}px)`,
            height: '100vh',
            maxHeight: '100vh',
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        mainBackground: {
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
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            color: 'white',
        },
        white: {
            color: 'white',
        },
    }),
);

export default () => {
    const classes = useStyles();

    const peerClient = useContext(PeerClientContext);

    const [currentConnection, setCurrentConnection] = React.useState<ConnectionInstance>(
        null,
    );

    const [isLoading, setIsLoading] = React.useState(false);
    const [clientInitialized, setInitialized] = React.useState(false);

    const [peerIdInput, setPeerIdInput] = React.useState('');
    const [messageInput, setMessageInput] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const [mediaStream, setMediaStream] = React.useState<string>(null);

    const initializeClient = async () => {
        setIsLoading(true);
        await peerClient.init(setCurrentConnection, addMessage, renderMedia);
        setInitialized(true);
        setIsLoading(false);
    };

    const addMessage = (message: string) => {
        console.log(messages);
        const newMessages = [...messages, message];
        console.log(newMessages);
        setMessages(newMessages);
    };

    const startNewConnection = async () => {
        const connection = await peerClient.createConnection(peerIdInput);
        connection.client.on('data', addMessage);
        setCurrentConnection(connection);
        setPeerIdInput('');
    };

    const sendMessage = async () => {
        currentConnection.client.send(messageInput);
        addMessage(messageInput);
        setMessageInput('');
    };

    const renderMedia = (stream: any) => {
        setMediaStream(stream);
    }

    return (
        <div className={classes.root}>
            <Drawer
                variant={'permanent'}
                anchor={'left'}
                className={classes.drawer}
                classes={{ paper: classes.drawerPaper }}
            >
                <Toolbar className={classes.drawerToolbarContent}>
                    <Typography variant={'body1'}>
                        Status: {clientInitialized ? 'Ready' : 'Offline'}
                    </Typography>
                    {clientInitialized && <Typography>ID: {peerClient.id}</Typography>}
                </Toolbar>
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
                                    inputProps={{
                                        style: {
                                            color: 'white',
                                        },
                                    }}
                                    style={{
                                        color: 'white',
                                    }}
                                />
                                <IconButton
                                    disabled={peerIdInput.length < 10}
                                    onClick={startNewConnection}
                                >
                                    <Plus />
                                </IconButton>
                            </ListItem>
                            {peerClient.getConnections().map((connection) => (
                                <ListItem>
                                    <Typography>{connection.connectionId}</Typography>
                                    <IconButton
                                        onClick={() =>
                                            peerClient.callPeer(
                                                connection.connectionId,
                                                renderMedia
                                            )
                                        }
                                    >
                                        <Phone />
                                    </IconButton>
                                    <IconButton>
                                        <Video />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </>
                    )}
                </List>
            </Drawer>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <h2>chat</h2>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {clientInitialized ? (
                    <List
                        className={clsx(
                            classes.mainBackground,
                            classes.messagesListContainer,
                        )}
                    >
                        {mediaStream === null ? (
                            messages.map((message, index) => (
                                <ListItem key={index} style={{ color: 'white' }}>
                                    <Typography variant={'caption'}>username</Typography>
                                    <Typography>{message}</Typography>
                                </ListItem>
                            ))
                        ) : (
                            <ReactPlayer url={mediaStream} />
                        )}
                    </List>
                ) : (
                    <Box
                        flex={1}
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        className={classes.mainBackground}
                    >
                        {isLoading ? (
                            <LinearProgress color={'secondary'} />
                        ) : (
                            <Button onClick={() => initializeClient()}>
                                Continue as Guest
                            </Button>
                        )}
                    </Box>
                )}
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
                        style={{
                            color: 'white',
                        }}
                    />
                    <Button
                        disabled={!clientInitialized || messageInput.length <= 0}
                        variant={'outlined'}
                        style={{ color: 'red' }}
                        onClick={sendMessage}
                    >
                        Send
                    </Button>
                </Box>
            </main>
        </div>
    );
};
