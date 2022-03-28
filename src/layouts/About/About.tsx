import React from 'react';
import clsx from 'clsx';
import { IconButton, List, ListItem, Typography } from '@material-ui/core';
import { Github } from 'mdi-material-ui';
import { NextSeo } from 'next-seo';
import useStyles from './styles';

const About = ({ libraries }: AboutProps) => {
    const classes = useStyles();

    return (
        <>
            <NextSeo
                title={'About'}
                description={'About this project'}
                openGraph={{
                    title: 'About',
                    description: 'About this project',
                    url: 'https://chat.nieky.dev/about',
                    site_name: 'uChat',
                    type: 'website',
                }}
            />
            <div className={classes.root}>
                <Typography>about this app</Typography>

                <Typography>Libraries Used</Typography>

                <List className={classes.libraryList}>
                    {libraries.map((library: string) => (
                        <ListItem className={classes.libraryItem} key={library}>
                            <Typography>{library}</Typography>
                            <IconButton
                                href={`https://npmjs.org/package/${library}`}
                                size={'small'}
                            >
                                <Github />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </div>
        </>
    );
};

export type AboutProps = {
    libraries: string[];
};

export default About;
