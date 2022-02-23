import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { PeerStatus } from 'types/peer';
import StatusIndicator from './StatusIndicator';

const useStyles = makeStyles((theme) =>
    createStyles({
        drawerToolbarContent: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: 'white',
        },
    }),
);

const StatusBar = ({ status }: { status: PeerStatus }) => {
    const classes = useStyles();

    return (
        <div className={classes.drawerToolbarContent}>
            <Typography variant={'body1'}>
                Status: {status === 'online' ? 'Ready' : 'Offline'}{' '}
            </Typography>
            <StatusIndicator status={status} />
        </div>
    );
};

export default StatusBar;
