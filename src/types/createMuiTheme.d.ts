import { Palette, PaletteOptions } from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createMuiTheme' {
    export interface Theme {
        palette: Palette;
    }

    export interface ThemeOptions {
        palette: PaletteOptions;
    }

    export default function createMuiTheme(
        options?: ThemeOptions,
        ...args: object[]
    ): Theme;
}
