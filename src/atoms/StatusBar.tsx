import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { PeerStatus } from 'types/peer';
import StatusIndicator from './StatusIndicator';

const useStyles = makeStyles((theme) =>
    createStyles({
        drawerToolbarContent: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            color: 'white',
        },
    }),
);

const StatusBar = ({ status }: { status: PeerStatus }) => {
    const classes = useStyles();

    return (
        <Toolbar className={classes.drawerToolbarContent}>
            <Typography variant={'body1'}>
                Status: {status === 'online' ? 'Ready' : 'Offline'}{' '}
                <StatusIndicator status={status} />
            </Typography>
        </Toolbar>
    );
}

export default StatusBar;
