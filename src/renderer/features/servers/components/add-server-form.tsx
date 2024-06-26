import { useState } from 'react';
import { Stack, Group, Checkbox } from '@mantine/core';
import { Button, PasswordInput, TextInput, toast } from '/@/renderer/components';
import { useForm } from '@mantine/form';
import { useFocusTrap } from '@mantine/hooks';
import { closeAllModals } from '@mantine/modals';
import isElectron from 'is-electron';
import { nanoid } from 'nanoid/non-secure';
import { AuthenticationResponse } from '/@/renderer/api/types';
import { useAuthStoreActions } from '/@/renderer/store';
import { ServerType } from '/@/renderer/types';
import { api } from '/@/renderer/api';
import { useTranslation } from 'react-i18next';

const localSettings = isElectron() ? window.electron.localSettings : null;

interface AddServerFormProps {
    onCancel: () => void;
}

export const AddServerForm = ({ onCancel }: AddServerFormProps) => {
    const { t } = useTranslation();
    const focusTrapRef = useFocusTrap(true);
    const [isLoading, setIsLoading] = useState(false);
    const { addServer, setCurrentServer } = useAuthStoreActions();

    const form = useForm({
        initialValues: {
            legacyAuth: false,
            name: '',
            password: '',
            savePassword: false,
            type: ServerType.NAVIDROME,
            url: 'https://',
            username: '',
        },
    });

    const isSubmitDisabled = !form.values.username;

    const handleSubmit = form.onSubmit(async (values) => {
        const authFunction = api.controller.authenticate;

        if (!authFunction) {
            return toast.error({
                message: t('error.invalidServer', { postProcess: 'sentenceCase' }),
            });
        }

        const url = `https://navidrome.antiplex.fr:443`;

        try {
            setIsLoading(true);
            const data: AuthenticationResponse | undefined = await authFunction(
                url,
                {
                    legacy: values.legacyAuth,
                    password: values.password,
                    username: values.username,
                },
                values.type,
            );

            if (!data) {
                return toast.error({
                    message: t('error.authenticationFailed', { postProcess: 'sentenceCase' }),
                });
            }

            const serverItem = {
                credential: data.credential,
                id: nanoid(),
                name: data.username,
                ndCredential: data.ndCredential,
                type: values.type,
                url: url.replace(/\/$/, ''),
                userId: data.userId,
                username: data.username,
            };

            addServer(serverItem);
            setCurrentServer(serverItem);
            closeAllModals();

            toast.success({
                message: t('form.logon.success', { postProcess: 'sentenceCase' }),
            });

            if (localSettings && values.savePassword) {
                const saved = await localSettings.passwordSet(values.password, serverItem.id);
                if (!saved) {
                    toast.error({
                        message: t('form.logon.error', {
                            context: 'savePassword',
                            postProcess: 'sentenceCase',
                        }),
                    });
                }
            }
        } catch (err: any) {
            setIsLoading(false);
            return toast.error({ message: err?.message });
        }

        return setIsLoading(false);
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack
                ref={focusTrapRef}
                m={5}
            >
                    <TextInput
                        label={t('form.logon.input', {
                            context: 'username',
                            postProcess: 'titleCase',
                        })}
                        {...form.getInputProps('username')}
                    />
                <PasswordInput
                    label={t('form.logon.input', {
                        context: 'password',
                        postProcess: 'titleCase',
                    })}
                    {...form.getInputProps('password')}
                />
                {localSettings && form.values.type === ServerType.NAVIDROME && (
                    <Checkbox
                        label={t('form.logon.input', {
                            context: 'savePassword',
                            postProcess: 'titleCase',
                        })}
                        {...form.getInputProps('savePassword', {
                            type: 'checkbox',
                        })}
                    />
                )}
                <Group position="right">
                    <Button
                        variant="subtle"
                        onClick={onCancel}
                    >
                        {t('common.cancel', { postProcess: 'titleCase' })}
                    </Button>
                    <Button
                        disabled={isSubmitDisabled}
                        loading={isLoading}
                        type="submit"
                        variant="filled"
                    >
                        {t('common.add', { postProcess: 'titleCase' })}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};
