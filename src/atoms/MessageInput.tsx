import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';

const MessageInput = ({
    disabled,
    onSubmit,
    messageInput,
    setMessageInput,
}: MessageInputProps) => {
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
            rows={2}
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
