import React from 'react';
import Peer from 'peerjs';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Phone from 'mdi-material-ui/Phone';
import Video from 'mdi-material-ui/Video';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useChat } from 'contexts/ChatContext';

const useStyles = makeStyles((theme) =>
    createStyles({
        white: {
            color: theme.palette.common.white,
        },
        activeCall: {
            backgroundColor: theme.palette.system.success,
            color: theme.palette.common.white,
        },
    }),
);

const ConnectionItem = ({ connection }: ConnectionItemProps) => {
    const classes = useStyles();
    const { setCurrentConnectionId } = useChat();

    return (
        <ListItem
            className={classes.white}
            onClick={() => setCurrentConnectionId(connection.peer)}
        >
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
            // disabled={Boolean(peerMediaStream)}
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
                // disabled={Boolean(peerMediaStream)}
                className={true && classes.activeCall}
            >
                <Video />
            </IconButton>
        </ListItem>
    );
};

type ConnectionItemProps = {
    connection: Peer.DataConnection;
};

export default ConnectionItem;
