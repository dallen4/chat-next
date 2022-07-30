import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@material-ui/core';
import theme from 'theme';
import { About } from 'layouts';
import { AboutPropTypes } from 'layouts/About/About';

describe(`About`, () => {
    const AboutWithTheme = (props: AboutPropTypes) => (
        <ThemeProvider theme={theme}>
            <About {...props} />
        </ThemeProvider>
    );

    // TODO tests here
    it(`should render without error`, () => {
        const wrapper = mount(
            <AboutWithTheme/>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
