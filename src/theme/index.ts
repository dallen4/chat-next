import { createMuiTheme } from '@material-ui/core';
import { TypographyOptions } from '@material-ui/core/styles/createTypography';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(39,44,53)',
            light: 'rgb(39,44,53, 0.8)',
        },
        secondary: {
            main: 'rgb(32,37,44)',
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
