import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        messageInput: {
            height: '100%',
            '& > div': {
                height: '100%',
            },
        }
    }),
);

const MessageInput = ({
    disabled,
    onSubmit,
    messageInput,
    setMessageInput,
}: MessageInputProps) => {
    const classes = useStyles();
    const inputRef = useRef<HTMLInputElement>(null);

    const onKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <TextField
            inputRef={inputRef}
            id={'messageInput'}
            name={'messageInput'}
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            onKeyDown={onKey}
            multiline
            minRows={2}
            className={classes.messageInput}
            variant={'outlined'}
            color={'primary'}
            placeholder={'Type your words here...'}
            disabled={disabled}
            fullWidth
        />
    );
};

type MessageInputProps = {
    messageInput: string;
    setMessageInput: (messageInput: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
};

export default MessageInput;
