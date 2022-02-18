import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Message } from 'types/message';

const MessageItem = (props: MessageItemProps) => {
    const { message } = props;
    const { timestamp, type, author, content } = message;

    return (
        <ListItem key={timestamp} style={{ color: 'white' }}>
            <Typography variant={'caption'}>{author}</Typography>
            <Typography>{content}</Typography>
        </ListItem>
    );
};

type MessageItemProps = {
    message: Message;
};

export default MessageItem;
