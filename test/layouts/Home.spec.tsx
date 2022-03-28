import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@material-ui/core';
import theme from 'theme/elevatorTheme';
import { Home } from 'layouts';
import { HomePropTypes } from 'layouts/Home/Home';

describe(`Home`, () => {
    const HomeWithTheme = (props: HomePropTypes) => (
        <ThemeProvider theme={theme}>
            <Home {...props} />
        </ThemeProvider>
    );

    // TODO tests here
    it(`should render without error`, () => {
        const wrapper = mount(
            <HomeWithTheme/>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
