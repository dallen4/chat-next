import React from 'react';
import { useChat } from 'contexts/ChatContext';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import StatusBar from 'atoms/StatusBar';
import AddConnectionInput from 'atoms/AddConnectionInput';
import List from '@material-ui/core/List';
import ConnectionItem from 'atoms/ConnectionItem';
import ReactPlayer from 'react-player';
import { drawerWidth } from 'lib/constants';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { IconButton, Toolbar, useMediaQuery } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';

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
        statusToolbar: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    }),
);

const Sidebar = ({ open, close }: SidebarProps) => {
    const classes = useStyles();
    const { isAuthenticated, connections, mediaStream } = useChat();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Drawer
            variant={mobile ? 'temporary' : 'persistent'}
            open={open}
            onClose={close}
            anchor={'left'}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <Toolbar className={classes.statusToolbar}>
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
                {open && (
                    <IconButton onClick={close} size={'small'}>
                        <ChevronLeft style={{ color: 'white' }} />
                    </IconButton>
                )}
            </Toolbar>
            <div style={{ flex: 1, padding: theme.spacing(1) }}>
                <AddConnectionInput />
                <List>
                    {connections.map((connection) => (
                        <ConnectionItem connection={connection} />
                    ))}
                </List>
            </div>
            {mediaStream !== null && (
                <ReactPlayer width={'100%'} height={'30%'} style={{}} url={mediaStream} />
            )}
            <Box padding={0.5} textAlign={'center'}>
                <Typography variant={'caption'} color={'primary'}>
                    Copyright &copy; Nieky Allen {new Date().getFullYear()}.
                </Typography>
            </Box>
        </Drawer>
    );
};

export type SidebarProps = {
    open: boolean;
    close: () => void;
};

export default Sidebar;
