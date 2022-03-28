import React, { useState } from 'react';
import {
    Theme,
    makeStyles,
    createStyles,
    Button,
    Box,
    useTheme,
    useMediaQuery,
    IconButton,
} from '@material-ui/core';
import MessageInput from 'atoms/MessageInput';
import { useMessages } from 'contexts/MessagesContext';
import { Send } from '@material-ui/icons';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        messageBox: {
            padding: theme.spacing(1),
            height: '95px',
            width: '100%',
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
        },
        mobileMessageBox: {
            height: '60px',
        },
        sendButton: {
            height: '79px',
            width: '79px',
            marginLeft: '0.5rem',
        },
        mobileSendButton: {
            height: '44px',
            width: '44px',
            marginLeft: '0.5rem',
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
    }),
);

const MessageBox = ({ disabled }: MessageBoxProps) => {
    const classes = useStyles();
    const [messageInput, setMessageInput] = useState('');

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { sendMessage } = useMessages();

    const onSend = () => {
        if (messageInput.length > 0) {
            const message = messageInput.trim();
            sendMessage(message);
            setMessageInput('');
        }
    };

    const btnProps = {
        disabled: disabled || messageInput.length === 0,
        onClick: onSend,
    };

    return (
        <Box className={clsx(classes.messageBox, {
            [classes.mobileMessageBox]: mobile,
        })}>
            <MessageInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                onSubmit={onSend}
                disabled={disabled}
            />
            {mobile ? (
                <IconButton
                    color={'primary'}
                    size={'small'}
                    className={classes.mobileSendButton}
                    {...btnProps}
                >
                    <Send />
                </IconButton>
            ) : (
                <Button
                    variant={'contained'}
                    color={'primary'}
                    className={classes.sendButton}
                    {...btnProps}
                >
                    Send
                </Button>
            )}
        </Box>
    );
};

type MessageBoxProps = {
    disabled?: boolean;
};

export default MessageBox;
