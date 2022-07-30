import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@material-ui/core';
import theme from 'theme/elevatorTheme';
import { WelcomeMessage } from 'atoms';
import { WelcomeMessagePropTypes } from 'atoms/WelcomeMessage/WelcomeMessage';

describe(`WelcomeMessage`, () => {
    const WelcomeMessageWithTheme = (props: WelcomeMessagePropTypes) => (
        <ThemeProvider theme={theme}>
            <WelcomeMessage {...props} />
        </ThemeProvider>
    );

    // TODO tests here
    it(`should render without error`, () => {
        const wrapper = mount(
            <WelcomeMessageWithTheme/>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
