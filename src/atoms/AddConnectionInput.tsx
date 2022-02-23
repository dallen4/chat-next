import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Plus from 'mdi-material-ui/Plus';
import React from 'react';

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

const AddConnectionInput = ({ onAdd, disabled }: AddConnectionInputProps) => {
    const classes = useStyles();
    const [peerIdInput, setPeerIdInput] = React.useState('');

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
                variant={'outlined'}
                color={'primary'}
                placeholder={'Peer ID'}
                disabled={disabled}
                fullWidth
            />
            <IconButton
                disabled={disabled || peerIdInput.length < 5}
                onClick={() => onAdd(peerIdInput)}
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

type AddConnectionInputProps = {
    onAdd: (peerId: string) => void;
    disabled?: boolean;
};

export default AddConnectionInput;
