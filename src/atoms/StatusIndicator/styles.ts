import { Theme, makeStyles, createStyles } from '@material-ui/core';

const styles = makeStyles((theme: Theme) =>
    createStyles({
        baseIndicator: {
            display: 'inline-block',
            marginLeft: theme.spacing(1),
            height: '10px',
            width: '10px',
            borderRadius: '50%',
        },
        errorVariant: {
            backgroundColor: 'rgb(240,39,51)',
            webkitBoxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(240,39,51, 0.8)',
            boxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(240,39,51, 0.8)',
        },
        warningVariant: {
            backgroundColor: 'rgb(255,190,51)',
            webkitBoxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(255,190,51, 0.8)',
            boxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(255,190,51, 0.8)',
        },
        successVariant: {
            backgroundColor: 'rgb(45,168,151)',
            webkitBoxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(45,168,151, 0.8)',
            boxShadow:
                '0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px rgba(45,168,151, 0.8)',
        },
    }),
);

export default styles;
