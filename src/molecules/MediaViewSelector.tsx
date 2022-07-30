import React from 'react';
import { Video, Chat } from 'mdi-material-ui';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useChat } from 'contexts/ChatContext';
import { MediaViewProps } from 'organisms/MediaView';
import { createStyles, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
    createStyles({
        bothButtonText: {
            color: theme.palette.primary.main,
            fontSize: '0.9rem',
        },
        mediaToggleIcons: {
            fontSize: '1.1rem',
            color: theme.palette.primary.main,
        },
    }),
);

const MediaViewSelector = ({ mode, setMode }: MediaViewProps) => {
    const classes = useStyles();
    const { connection, peerMediaStream } = useChat();

    return (
        <ButtonGroup disableElevation>
            {connection && (
                <>
                    <Button
                        onClick={() => setMode('Chat')}
                        variant={mode === 'Chat' ? 'contained' : null}
                    >
                        <Chat className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMode('Video')}
                        disabled={!peerMediaStream}
                        variant={mode === 'Video' ? 'contained' : null}
                    >
                        <Video className={classes.mediaToggleIcons} />
                    </Button>
                    <Button
                        onClick={() => setMode('Both')}
                        disabled={!peerMediaStream}
                        variant={mode === 'Both' ? 'contained' : null}
                    >
                        <Typography className={classes.bothButtonText}>Both</Typography>
                    </Button>
                </>
            )}
        </ButtonGroup>
    );
};

export default MediaViewSelector;
