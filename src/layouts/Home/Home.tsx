import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    CircularProgress,
    ButtonGroup,
} from '@material-ui/core';
import { Video, Chat } from 'mdi-material-ui';
import useStyles from './styles';
import { MediaViewMode } from 'types/core';
import { useChat } from 'contexts/ChatContext';
import Sidebar from 'molecules/Sidebar';
import MediaView from 'organisms/MediaView';

const Home = () => {
    const classes = useStyles();
    const {
        authenticate,
        isAuthenticated,
        status,
        connection,
        peer,
        peerMediaStream,
    } = useChat();

    const [mediaViewMode, setMediaViewMode] = React.useState<MediaViewMode>('Chat');

    const MediaViewSelector = () => (
        <ButtonGroup disableElevation>
            {connection && (
                <>
                    <Button
                        onClick={() => setMediaViewMode('Chat')}
                        variant={mediaViewMode === 'Chat' ? 'contained' : null}
                    >
                        <Chat className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Video')}
                        disabled={!peerMediaStream}
                        variant={mediaViewMode === 'Video' ? 'contained' : null}
                    >
                        <Video className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMediaViewMode('Both')}
                        disabled={!peerMediaStream}
                        variant={mediaViewMode === 'Both' ? 'contained' : null}
                    >
                        <Typography className={classes.bothButtonText}>Both</Typography>
                    </Button>
                </>
            )}
        </ButtonGroup>
    );

    return (
        <div className={classes.root}>
            <Sidebar />
            <AppBar color={'secondary'} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <MediaViewSelector />
                    <div>
                        {isAuthenticated ? (
                            <Typography>ID: {peer.id}</Typography>
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
            <div className={classes.content}>
                <div className={classes.toolbarSpacer} />
                <MediaView />
            </div>
        </div>
    );
};

export default Home;
