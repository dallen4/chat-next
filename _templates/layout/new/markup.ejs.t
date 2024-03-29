---
to: src/layouts/<%=name%>/<%=name%>.tsx
---
import React from 'react';
import clsx from 'clsx';
import useStyles from './styles';

const <%= h.changeCase.ucFirst(name) %> = (props: <%= h.changeCase.ucFirst(name) %>Props) => {
    const classes = useStyles();

    return (
        <div></div>
    );
};

export type <%= h.changeCase.ucFirst(name) %>Props = {
}

export default <%= h.changeCase.ucFirst(name) %>;
