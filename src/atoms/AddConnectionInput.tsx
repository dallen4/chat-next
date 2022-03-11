import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useChat } from 'contexts/ChatContext';
import Plus from 'mdi-material-ui/Plus';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) =>
    createStyles({
        white: {
            color: 'white',
        },
        activeAddPeer: {
            color: theme.palette.secondary.light,
        },
    }),
);

const AddConnectionInput = () => {
    const classes = useStyles();
    const [peerIdInput, setPeerIdInput] = useState('');
    const { isAuthenticated, connect } = useChat();

    const onSubmit = () => {
        connect(peerIdInput);
        setPeerIdInput('');
    };

    const onKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={1}
        >
            <TextField
                id={'peerIdInput'}
                name={'peerIdInput'}
                value={peerIdInput}
                onChange={(event) => setPeerIdInput(event.target.value)}
                onKeyDown={onKey}
                variant={'outlined'}
                color={'primary'}
                placeholder={'Peer ID'}
                disabled={!isAuthenticated}
                fullWidth
            />
            <IconButton
                disabled={!isAuthenticated || peerIdInput.length < 5}
                onClick={onSubmit}
                size={'small'}
            >
                <Plus
                    className={
                        peerIdInput.length < 5 ? classes.white : classes.activeAddPeer
                    }
                />
            </IconButton>
        </Box>
    );
};

export default AddConnectionInput;
