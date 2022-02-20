import React, { useRef, useState } from 'react';
import { Theme, makeStyles, createStyles, Button, Box } from '@material-ui/core';
import MessageInput from 'atoms/MessageInput';
import { useChat } from 'contexts/ChatContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        messageBox: {
            padding: theme.spacing(1),
            height: '95px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.light,
        },
        sendButton: {
            height: '79px',
            width: '79px',
            marginLeft: '0.5rem',
        },
    }),
);

const MessageBox = ({ disabled }: MessageBoxProps) => {
    const classes = useStyles();
    const [messageInput, setMessageInput] = useState('');

    const { sendMessage } = useChat();

    const onSend = () => {
        if (messageInput.length > 0) {
            const message = messageInput.trim();
            sendMessage(message);
            setMessageInput('');
        }
    };

    return (
        <Box className={classes.messageBox}>
            <MessageInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                onSubmit={onSend}
                disabled={disabled}
            />
            <Button
                disabled={disabled || messageInput.length === 0}
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
