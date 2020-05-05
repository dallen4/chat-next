---
to: src/layouts/<%=name%>/index.tsx
---
import React from 'react';
import withLayout from 'hocs/withLayout';
import { useQuery } from '@apollo/react-hooks';
import clsx from 'clsx';
import useStyles from './styles';
import <%=name%> from './<%=name%>';

const Index = (props: <%= h.changeCase.ucFirst(name) %>IndexPropTypes) => {
    const classes = useStyles();

    return (
        <<%= h.changeCase.ucFirst(name) %> />
    );
};

export type <%= h.changeCase.ucFirst(name) %>IndexPropTypes = {
}

export default Index;
