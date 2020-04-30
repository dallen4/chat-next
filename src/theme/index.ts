import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#FF5301',
        },
        secondary: {
            main: '#052E54',
            light: '#365775',
        },
        common: {
            black: '',
            white: '#FFFFFF',
        },
        custom: {
            grey: {
                light: '#F5F7F8',
                mid: '#D3D7DB',
            },
            footer: {
                dark: '#1B2024',
                light: '#23282C',
            },
        },
    },
});

export default theme;
