import { Theme, makeStyles, createStyles } from '@material-ui/core';
import { drawerWidth } from 'lib/constants';

const styles: any = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        toolbar: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        // necessary for content to be below app bar
        toolbarSpacer: theme.mixins.toolbar,
        content: {
            width: `100%`,
            height: '100vh',
            maxHeight: '100vh',
            flexGrow: 1,
            backgroundColor: theme.palette.secondary.main,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            [theme.breakpoints.up('sm')]: {
                marginLeft: -drawerWidth,
            },
        },
        contentShift: {
            marginLeft: 0,
        },
        bothButtonText: {
            color: theme.palette.primary.main,
            fontSize: '0.9rem',
        },
        mediaToggleIcons: {
            fontSize: '1.1rem',
            color: theme.palette.primary.main,
        },
        endCallButton: {
            color: theme.palette.system.error,
        },
    });

export default makeStyles(styles);
