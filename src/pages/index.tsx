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
} from '@material-ui/core';
import { PeerClientContext } from 'contexts/PeerClientContext';
import { Plus } from 'mdi-material-ui';
import clsx from 'clsx';

const drawerWidth = 220;

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
    const [clientInitialized, setInitialized] = React.useState(false);

    const initializeClient = async () => {
        await peerClient.init();
        setInitialized(true);
    };

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
                <List>
                    {clientInitialized && (
                        <ListItem>
                            <Button endIcon={<Plus />}>Create Channel</Button>
                        </ListItem>
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
                        <ListItem>
                            <Typography variant={'caption'}>username</Typography>
                        </ListItem>
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
                        <Button onClick={() => initializeClient()}>
                            Continue as Guest
                        </Button>
                    </Box>
                )}
                <Box padding={1} className={classes.messageBox}>
                    <TextField
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
                        disabled={!clientInitialized}
                        variant={'outlined'}
                        style={{ color: 'red' }}
                    >
                        Send
                    </Button>
                </Box>
            </main>
        </div>
    );
};
