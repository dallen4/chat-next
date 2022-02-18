import { useSnackbar } from 'notistack';
import { nanoid } from 'nanoid';
import { Button, useTheme } from '@material-ui/core';

export function useNotification() {
    const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const genKey = () => nanoid();

    const pushSucessMessage = (message: string) => {
        const key = genKey();

        enqueueSnackbar(message, {
            key,
            variant: 'success',
        });

        return () => closeSnackbar(key);
    };

    const pushInfoMessage = (message: string) => {
        const key = genKey();

        enqueueSnackbar(message, {
            key,
            variant: 'info',
        });

        return () => closeSnackbar(key);
    };

    const pushErrorMessage = (message: string, retryAction?: () => any) => {
        const key = genKey();

        enqueueSnackbar(message, {
            key,
            variant: 'error',
            action: (
                <Button
                    style={{ color: theme.palette.secondary.main }}
                    onClick={retryAction}
                >
                    Retry
                </Button>
            ),
            preventDuplicate: true,
        });

        return () => closeSnackbar(key);
    };

    return { pushSucessMessage, pushInfoMessage, pushErrorMessage };
}
