import React from 'react';
import { useChat } from 'contexts/ChatContext';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import StatusBar from 'atoms/StatusBar';
import AddConnectionInput from 'atoms/AddConnectionInput';
import List from '@material-ui/core/List';
import ConnectionItem from 'atoms/ConnectionItem';
import ReactPlayer from 'react-player';
import { drawerWidth } from 'lib/constants';

const useStyles = makeStyles((theme) =>
    createStyles({
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
    }),
);

const Sidebar = () => {
    const classes = useStyles();
    const { isAuthenticated, connect, connections, mediaStream } = useChat();

    return (
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
                <AddConnectionInput onAdd={connect} disabled={!isAuthenticated} />
                <List style={{ color: 'white' }}>
                    {connections.map((connection) => (
                        <ConnectionItem connection={connection} />
                    ))}
                </List>
            </div>
            {mediaStream !== null && (
                <ReactPlayer width={'100%'} height={'30%'} style={{}} url={mediaStream} />
            )}
        </Drawer>
    );
};

export default Sidebar;
