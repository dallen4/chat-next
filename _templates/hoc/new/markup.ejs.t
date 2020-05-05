---
to: src/hocs/<%=name%>/<%=name%>.tsx
---
import React from 'react';
import { NextComponentType, NextPageContext } from 'next';
import { PageProps } from 'types/page';
import clsx from 'clsx';
import useStyles from './styles';

const <%= name %> = (
    Component: NextComponentType<NextPageContext, any, PageProps>
) => (props: PageProps) => {
    const classes = useStyles();

    return <Component {...props} />;
};

export default <%= name %>;
