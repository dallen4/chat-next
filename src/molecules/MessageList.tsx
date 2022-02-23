import List from '@material-ui/core/List';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MessageItem from 'atoms/MessageItem';
import React, { useEffect } from 'react';
import { Message } from 'types/message';

const useStyles = makeStyles((theme) =>
    createStyles({
        messagesListContainer: {
            overflow: 'scroll',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        scrollRefContainer: {
            height: 0,
            width: '100%',
        },
    }),
);

const MessageList = ({ messages }: MessageListProps) => {
    const classes = useStyles();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <List className={classes.messagesListContainer}>
            {messages.map((message, index) => (
                <MessageItem key={index} message={message} />
            ))}
            <div ref={scrollRef} className={classes.scrollRefContainer} />
        </List>
    );
};

export type MessageListProps = {
    messages: Message[];
};

export default MessageList;
