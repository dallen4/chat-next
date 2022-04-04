import { createTheme, ThemeOptions } from '@material-ui/core/styles';

type ColorOptions = {
    primary?: string;
    secondary?: string;
    error?: string;
    warning?: string;
    info?: string;
    success?: string;
};

export const buildTheme = (options: ColorOptions = {}) => {
    const { primary, secondary, error, warning, info, success } = options;

    const theme = createTheme({
        palette: {
            primary: {
                main: primary || '#3373ff',
                light: 'rgb(39,44,53, 0.8)',
            },
            secondary: {
                main: secondary || '#3a3c43',
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
                error: error || '#f02733',
                warning: warning || '#ffbe33',
                info: info || '#5833ff',
                success: success || '#1CFFF6',
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

    return theme;
};

export const newTheme: ThemeOptions = {
    palette: {
        type: 'dark',
        primary: {
            dark: '#014BE7',
            main: '#3373ff',
            light: '#5C90FF',
        },
        secondary: {
            dark: '#3501E9',
            main: '#6336FF',
            light: '#825EFF',
        },
        common: {
            black: '#000000',
            white: '#FFFFFF',
        },
        background: {
            default: '#12151c',
            paper: '#191c23',
        },
        text: {
            primary: '#DcDcDc',
        },
        system: {
            error: '#f02733',
            warning: '#ffbe33',
            info: '#5833ff',
            success: '#1CFFF6',
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
    typography: {
        fontFamily: 'Lato',
        body1: {
            fontFamily: 'Lato',
        },
    },
    props: {
        MuiButtonBase: {
            disableRipple: true,
        },
        MuiAppBar: {
            color: 'default',
        },
    },
};

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
