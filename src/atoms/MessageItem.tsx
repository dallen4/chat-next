import { Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { useChat } from 'contexts/ChatContext';
import { generateAvatarColor } from 'lib/util';
import React from 'react';
import { Message } from 'types/message';

const useStyles = makeStyles((theme) =>
    createStyles({
        item: {
            '&:not(:first-child)': {
                marginTop: theme.spacing(0.75),
            },
        },
        white: {
            color: 'white',
        },
        alert: {
            width: '100%',
            color: 'white',
        },
        avatar: {
            color: 'white',
            marginRight: theme.spacing(1.5),
        },
        author: {
            fontWeight: 'bold',
            lineHeight: '14px',
            marginRight: theme.spacing(0.75),
        },
    }),
);

const MessageItem = (props: MessageItemProps) => {
    const classes = useStyles();
    const { connection } = useChat();

    const { message } = props;
    const { timestamp, type, author, content } = message;

    const avatarColor = connection ? connection.metadata[author] : generateAvatarColor();

    return (
        <ListItem key={timestamp} className={clsx(classes.item, classes.white)}>
            {type === 'system' ? (
                <Alert variant={'outlined'} severity={'info'} className={classes.alert}>
                    <Typography>{content}</Typography>
                </Alert>
            ) : (
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    <Avatar
                        className={classes.avatar}
                        style={{ backgroundColor: avatarColor }}
                    >
                        <Typography>{author.slice(0, 1).toUpperCase()}</Typography>
                    </Avatar>
                    <Box>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'flex-start'}
                            alignItems={'flex-end'}
                            paddingBottom={1.25}
                        >
                            <Typography variant={'body2'} className={classes.author}>
                                {author}
                            </Typography>
                            <Typography variant={'caption'} style={{ opacity: 0.65, lineHeight: '12px' }}>
                                {new Date(timestamp).toDateString()}
                            </Typography>
                        </Box>
                        <Typography>{content}</Typography>
                    </Box>
                </Box>
            )}
        </ListItem>
    );
};

type MessageItemProps = {
    message: Message;
};

export default MessageItem;
