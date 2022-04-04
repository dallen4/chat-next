import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
    createStyles({
        messageInput: {
            height: '100%',
            '& > div': {
                height: '100%',
            },
        },
        mobileMessageInput: {
            '& > div': {
                height: '100%',
                borderRadius: '25px / 50%',
            },
        },
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

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            inputProps={{
                enterKeyHint: 'send',
            }}
            multiline={!mobile}
            minRows={!mobile && 2}
            className={clsx(classes.messageInput, {
                [classes.mobileMessageInput]: mobile,
            })}
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
