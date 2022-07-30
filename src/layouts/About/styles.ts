import { makeStyles, createStyles } from '@material-ui/core';

const styles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.secondary.main,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '100vw',
            height: '100%',
            minHeight: '100vh',
            color: 'white',
        },
        libraryList: {
            WebkitColumnCount: 2 /* Chrome, Safari, Opera */,
            MozColumnCount: 2 /* Firefox */,
            columnCount: 2,
            width: '100%',
            maxWidth: '700px',
        },
        libraryItem: {
            padding: 0,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
        },
    }),
);

export default styles;
