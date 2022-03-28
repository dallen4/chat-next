import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@material-ui/core';
import theme from 'theme/elevatorTheme';
import { StatusIndicator } from 'atoms';
import { StatusIndicatorPropTypes } from 'atoms/StatusIndicator/StatusIndicator';

describe(`StatusIndicator`, () => {
    const StatusIndicatorWithTheme = (props: StatusIndicatorPropTypes) => (
        <ThemeProvider theme={theme}>
            <StatusIndicator {...props} />
        </ThemeProvider>
    );

    // TODO tests here
    it(`should render without error`, () => {
        const wrapper = mount(
            <StatusIndicatorWithTheme/>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
