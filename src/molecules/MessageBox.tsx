import React, { useRef } from 'react';
import { Theme, makeStyles, createStyles, Button, Box } from '@material-ui/core';
import MessageInput, { MessageInputRef } from 'atoms/MessageInput';
import { useChat } from 'contexts/ChatContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        messageBox: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.light,
        },
        sendButton: {
            height: '75px',
            width: '75px',
            marginLeft: '0.5rem',
        },
    }),
);

const MessageBox = ({ disabled }: MessageBoxProps) => {
    const classes = useStyles();
    const messageInput = useRef<MessageInputRef>(null);

    const {
        authenticate,
        isAuthenticated,
        status,
        sendMessage,
        peer,
        mediaStream,
        peerMediaStream,
    } = useChat();

    const onSend = () => {
        sendMessage(messageInput.current.getInputValue());
    };

    return (
        <Box padding={1} className={classes.messageBox}>
            <MessageInput ref={messageInput} onSubmit={sendMessage} disabled={disabled} />
            <Button
                disabled={disabled}
                variant={'contained'}
                color={'primary'}
                onClick={onSend}
                className={classes.sendButton}
            >
                Send
            </Button>
        </Box>
    );
};

type MessageBoxProps = {
    disabled?: boolean;
};

export default MessageBox;
