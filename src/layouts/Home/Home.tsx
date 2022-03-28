import React, { useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    CircularProgress,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import useStyles from './styles';
import { MediaViewMode } from 'types/core';
import { useChat } from 'contexts/ChatContext';
import Sidebar from 'molecules/Sidebar';
import MediaView from 'organisms/MediaView';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import MediaViewSelector from 'molecules/MediaViewSelector';

const Home = () => {
    const classes = useStyles();
    const { authenticate, isAuthenticated, status, currentUser } = useChat();

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [sidebarOpen, setSidebarOpen] = React.useState(!mobile);
    const [mediaViewMode, setMediaViewMode] = React.useState<MediaViewMode>('Chat');

    useEffect(() => {
        setSidebarOpen(!mobile);
    }, []);

    return (
        <div className={classes.root}>
            <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />
            <AppBar
                color={'default'}
                className={clsx({
                    [classes.appBarShift]: sidebarOpen,
                })}
            >
                <Toolbar className={classes.toolbar}>
                    {!sidebarOpen && (
                        <IconButton onClick={() => setSidebarOpen(true)}>
                            <MenuIcon style={{ color: 'white' }} />
                        </IconButton>
                    )}
                    <MediaViewSelector mode={mediaViewMode} setMode={setMediaViewMode} />
                    <div>
                        {isAuthenticated ? (
                            <Typography>{currentUser.username}</Typography>
                        ) : (
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                style={{ color: 'white', width: '180px', height: '36px' }}
                                onClick={authenticate}
                            >
                                {status === 'connecting' ? (
                                    <CircularProgress color={'inherit'} size={'14px'} />
                                ) : (
                                    'Continue as Guest'
                                )}
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <div
                className={clsx(classes.content, {
                    [classes.contentShift]: sidebarOpen,
                })}
            >
                <div className={classes.toolbarSpacer} />
                <MediaView mode={mediaViewMode} setMode={setMediaViewMode} />
            </div>
        </div>
    );
};

export default Home;
