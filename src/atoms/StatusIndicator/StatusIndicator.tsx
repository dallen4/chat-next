import React from 'react';
import clsx from 'clsx';
import useStyles from './styles';
import { PeerStatus } from 'types/peer';

export type StatusIndicatorPropTypes = {
    status: PeerStatus;
};

const StatusIndicator = (props: StatusIndicatorPropTypes) => {
    const classes = useStyles();

    const getStatusClass = () => {
        switch (props.status) {
            case 'pending':
                return classes.warningVariant;
            case 'online':
                return classes.successVariant;
            case 'offline':
            case 'error':
            default:
                return classes.errorVariant;
        }
    };

    return (
        <div className={clsx(classes.baseIndicator, getStatusClass())} />
    );
};

export default StatusIndicator;
