import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3373ff',
            light: 'rgb(39,44,53, 0.8)',
        },
        secondary: {
            main: '#3a3c43',
            light: '#4c4f59',
        },
        background: {
            default: '#12151c',
            paper: '#191c23',
        },
        common: {
            black: '#000000',
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
        system: {
            error: '#f02733',
            warning: '#ffbe33',
            info: '#5833ff',
            success: '#2da897',
        },
    },
    overrides: {
        MuiInputBase: {
            input: {
                '&::placeholder': {
                    color: 'white',
                },
                color: 'white',
            },
        },
    },
});

export default theme;
