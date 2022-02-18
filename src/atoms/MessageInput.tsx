import React, { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';

const MessageInput = (
    { disabled, onSubmit }: MessageInputProps,
    ref: Ref<MessageInputRef>,
) => {
    const [messageInput, setMessageInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        getInputValue: () => messageInput,
    }));

    const onKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit(messageInput);
            setMessageInput('');
            inputRef.current.focus();
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
    onSubmit: (message: string) => void;
    disabled?: boolean;
};

export type MessageInputRef = {
    getInputValue: () => string;
};

export default forwardRef<MessageInputRef, MessageInputProps>(MessageInput);
