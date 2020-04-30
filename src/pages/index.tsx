import React, { useContext } from 'react';
import { isClient } from 'config';
import PeerClient from 'lib/peer/client';
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
    ListItemText,
    Button,
} from '@material-ui/core';
import { PeerClientContext } from 'contexts/PeerClientContext';

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
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            width: `calc(100% - ${drawerWidth}px)`,
            height: '100vh',
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        messageBox: {
            backgroundColor: theme.palette.secondary.light,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    }),
);

export default () => {
    const classes = useStyles();

    const peerClient = useContext(PeerClientContext);
    const [clientInitialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        peerClient.init().then(() => setInitialized(true));
    }, []);

    return (
        <div className={classes.root}>
            <Drawer
                variant={'permanent'}
                anchor={'left'}
                className={classes.drawer}
                classes={{ paper: classes.drawerPaper }}
            >
                <div className={classes.toolbar} />
                <List>
                    <ListItem>
                        <ListItemText>
                            Status: {clientInitialized ? 'Ready' : 'Offline'}
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        {clientInitialized && (
                            <ListItemText>Your Chat ID: {peerClient.id}</ListItemText>
                            <ListItemText>Share with a friend</ListItemText>
                        )}
                    </ListItem>
                </List>
            </Drawer>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <h2>chat</h2>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Box flex={1}></Box>
                <Box padding={1} className={classes.messageBox}>
                    <TextField
                        multiline
                        rows={2}
                        variant={'outlined'}
                        label={'Your Message'}
                        placeholder={'Type your words here...'}
                        fullWidth
                    />
                    <Button variant={'outlined'}>Send</Button>
                </Box>
            </main>
        </div>
    );
};
