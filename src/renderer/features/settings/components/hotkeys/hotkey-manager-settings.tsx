import isElectron from 'is-electron';
import debounce from 'lodash/debounce';
import { ChangeEvent, KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './hotkeys-manager-settings.module.css';

import i18n from '/@/i18n/i18n';
import { SettingsOptions } from '/@/renderer/features/settings/components/settings-option';
import { useSettingSearchContext } from '/@/renderer/features/settings/context/search-context';
import { BindingActions, useHotkeySettings, useSettingsStoreActions } from '/@/renderer/store';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';
import { Checkbox } from '/@/shared/components/checkbox/checkbox';
import { Group } from '/@/shared/components/group/group';
import { Icon } from '/@/shared/components/icon/icon';
import { TextInput } from '/@/shared/components/text-input/text-input';

const ipc = isElectron() ? window.api.ipc : null;

const BINDINGS_MAP: Record<BindingActions, string> = {
    browserBack: i18n.t('setting.hotkey', { context: 'browserBack', postProcess: 'sentenceCase' }),
    browserForward: i18n.t('setting.hotkey', {
        context: 'browserForward',
        postProcess: 'sentenceCase',
    }),
    favoriteCurrentAdd: i18n.t('setting.hotkey', {
        context: 'favoriteCurrentSong',
        postProcess: 'sentenceCase',
    }),
    favoriteCurrentRemove: i18n.t('setting.hotkey', {
        context: 'unfavoriteCurrentSong',
        postProcess: 'sentenceCase',
    }),
    favoriteCurrentToggle: i18n.t('setting.hotkey', {
        context: 'toggleCurrentSongFavorite',
        postProcess: 'sentenceCase',
    }),
    favoritePreviousAdd: i18n.t('setting.hotkey', {
        context: 'favoritePreviousSong',
        postProcess: 'sentenceCase',
    }),
    favoritePreviousRemove: i18n.t('setting.hotkey', {
        context: 'unfavoritePreviousSong',
        postProcess: 'sentenceCase',
    }),
    favoritePreviousToggle: i18n.t('setting.hotkey', {
        context: 'togglePreviousSongFavorite',
        postProcess: 'sentenceCase',
    }),
    globalSearch: i18n.t('setting.hotkey', {
        context: 'globalSearch',
        postProcess: 'sentenceCase',
    }),
    localSearch: i18n.t('setting.hotkey', { context: 'localSearch', postProcess: 'sentenceCase' }),
    next: i18n.t('setting.hotkey', { context: 'playbackNext', postProcess: 'sentenceCase' }),
    pause: i18n.t('setting.hotkey', { context: 'playbackPause', postProcess: 'sentenceCase' }),
    play: i18n.t('setting.hotkey', { context: 'playbackPlay', postProcess: 'sentenceCase' }),
    playPause: i18n.t('setting.hotkey', {
        context: 'playbackPlayPause',
        postProcess: 'sentenceCase',
    }),
    previous: i18n.t('setting.hotkey', {
        context: 'playbackPrevious',
        postProcess: 'sentenceCase',
    }),
    rate0: i18n.t('setting.hotkey', { context: 'rate0', postProcess: 'sentenceCase' }),
    rate1: i18n.t('setting.hotkey', { context: 'rate1', postProcess: 'sentenceCase' }),
    rate2: i18n.t('setting.hotkey', { context: 'rate2', postProcess: 'sentenceCase' }),
    rate3: i18n.t('setting.hotkey', { context: 'rate3', postProcess: 'sentenceCase' }),
    rate4: i18n.t('setting.hotkey', { context: 'rate4', postProcess: 'sentenceCase' }),
    rate5: i18n.t('setting.hotkey', { context: 'rate5', postProcess: 'sentenceCase' }),
    skipBackward: i18n.t('setting.hotkey', {
        context: 'skipBackward',
        postProcess: 'sentenceCase',
    }),
    skipForward: i18n.t('setting.hotkey', { context: 'skipForward', postProcess: 'sentenceCase' }),
    stop: i18n.t('setting.hotkey', { context: 'playbackStop', postProcess: 'sentenceCase' }),
    toggleFullscreenPlayer: i18n.t('setting.hotkey', {
        context: 'toggleFullScreenPlayer',
        postProcess: 'sentenceCase',
    }),
    toggleQueue: i18n.t('setting.hotkey', { context: 'toggleQueue', postProcess: 'sentenceCase' }),
    toggleRepeat: i18n.t('setting.hotkey', {
        context: 'toggleRepeat',
        postProcess: 'sentenceCase',
    }),
    toggleShuffle: i18n.t('setting.hotkey', {
        context: 'toggleShuffle',
        postProcess: 'sentenceCase',
    }),
    volumeDown: i18n.t('setting.hotkey', { context: 'volumeDown', postProcess: 'sentenceCase' }),
    volumeMute: i18n.t('setting.hotkey', { context: 'volumeMute', postProcess: 'sentenceCase' }),
    volumeUp: i18n.t('setting.hotkey', { context: 'volumeUp', postProcess: 'sentenceCase' }),
    zoomIn: i18n.t('setting.hotkey', { context: 'zoomIn', postProcess: 'sentenceCase' }),
    zoomOut: i18n.t('setting.hotkey', { context: 'zoomOut', postProcess: 'sentenceCase' }),
};

export const HotkeyManagerSettings = () => {
    const { t } = useTranslation();
    const { bindings, globalMediaHotkeys } = useHotkeySettings();
    const { setSettings } = useSettingsStoreActions();
    const [selected, setSelected] = useState<BindingActions | null>(null);
    const keyword = useSettingSearchContext();

    const debouncedSetHotkey = debounce(
        (binding: BindingActions, e: KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const IGNORED_KEYS = ['Control', 'Alt', 'Shift', 'Meta', ' ', 'Escape'];
            const keys: string[] = [];
            if (e.ctrlKey) keys.push('mod');
            if (e.altKey) keys.push('alt');
            if (e.shiftKey) keys.push('shift');
            if (e.metaKey) keys.push('meta');
            if (e.key === ' ') keys.push('space');
            if (!IGNORED_KEYS.includes(e.key)) {
                if (e.code.includes('Numpad')) {
                    if (e.key === '+') keys.push('numpadadd');
                    else if (e.key === '-') keys.push('numpadsubtract');
                    else if (e.key === '*') keys.push('numpadmultiply');
                    else if (e.key === '/') keys.push('numpaddivide');
                    else if (e.key === '.') keys.push('numpaddecimal');
                    else keys.push(`numpad${e.key}`.toLowerCase());
                } else if (e.key === '+') {
                    keys.push('equal');
                } else {
                    keys.push(e.key?.toLowerCase());
                }
            }

            const bindingString = keys.join('+');

            const updatedBindings = {
                ...bindings,
                [binding]: { ...bindings[binding], hotkey: bindingString },
            };

            setSettings({
                hotkeys: {
                    bindings: updatedBindings,
                    globalMediaHotkeys,
                },
            });

            ipc?.send('set-global-shortcuts', updatedBindings);
        },
        20,
    );

    const handleSetHotkey = useCallback(debouncedSetHotkey, [
        bindings,
        globalMediaHotkeys,
        setSettings,
        debouncedSetHotkey,
    ]);

    const handleSetGlobalHotkey = useCallback(
        (binding: BindingActions, e: ChangeEvent<HTMLInputElement>) => {
            const updatedBindings = {
                ...bindings,
                [binding]: { ...bindings[binding], isGlobal: e.currentTarget.checked },
            };

            setSettings({
                hotkeys: {
                    bindings: updatedBindings,
                    globalMediaHotkeys,
                },
            });

            ipc?.send('set-global-shortcuts', updatedBindings);
        },
        [bindings, globalMediaHotkeys, setSettings],
    );

    const handleClearHotkey = useCallback(
        (binding: BindingActions) => {
            const updatedBindings = {
                ...bindings,
                [binding]: { ...bindings[binding], hotkey: '', isGlobal: false },
            };

            setSettings({
                hotkeys: {
                    bindings: updatedBindings,
                    globalMediaHotkeys,
                },
            });

            ipc?.send('set-global-shortcuts', updatedBindings);
        },
        [bindings, globalMediaHotkeys, setSettings],
    );

    const duplicateHotkeyMap = useMemo(() => {
        const countPerHotkey = Object.values(bindings).reduce(
            (acc, key) => {
                const hotkey = key.hotkey;
                if (!hotkey) return acc;

                if (acc[hotkey]) {
                    acc[hotkey] += 1;
                } else {
                    acc[hotkey] = 1;
                }

                return acc;
            },
            {} as Record<string, number>,
        );

        const duplicateKeys = Object.keys(countPerHotkey).filter((key) => countPerHotkey[key] > 1);

        return duplicateKeys;
    }, [bindings]);

    const filteredBindings = useMemo(() => {
        const base = Object.keys(bindings);

        if (keyword === '') {
            return base.filter((binding) => BINDINGS_MAP[binding as keyof typeof BINDINGS_MAP]);
        }

        return base.filter((binding) => {
            const item = BINDINGS_MAP[binding as keyof typeof BINDINGS_MAP];
            if (!item) return false;

            return item.toLocaleLowerCase().includes(keyword);
        });
    }, [bindings, keyword]);

    return (
        <>
            <SettingsOptions
                control={<></>}
                description={t('setting.applicationHotkeys', {
                    context: 'description',
                    postProcess: 'sentenceCase',
                })}
                title={t('setting.applicationHotkeys', { postProcess: 'sentenceCase' })}
            />
            <div className={styles.container}>
                {filteredBindings.map((binding) => (
                    <Group
                        key={`hotkey-${binding}`}
                        wrap="nowrap"
                    >
                        <TextInput
                            readOnly
                            style={{ userSelect: 'none' }}
                            value={BINDINGS_MAP[binding as keyof typeof BINDINGS_MAP]}
                        />
                        <TextInput
                            id={`hotkey-${binding}`}
                            leftSection={<Icon icon="keyboard" />}
                            onBlur={() => setSelected(null)}
                            onChange={() => {}}
                            onKeyDownCapture={(e) => {
                                if (selected !== (binding as BindingActions)) return;
                                handleSetHotkey(binding as BindingActions, e);
                            }}
                            readOnly
                            rightSection={
                                <ActionIcon
                                    icon="edit"
                                    onClick={() => {
                                        setSelected(binding as BindingActions);
                                        document.getElementById(`hotkey-${binding}`)?.focus();
                                    }}
                                    variant="transparent"
                                />
                            }
                            style={{
                                opacity: selected === (binding as BindingActions) ? 0.8 : 1,
                                outline: duplicateHotkeyMap.includes(
                                    bindings[binding as keyof typeof BINDINGS_MAP].hotkey!,
                                )
                                    ? '1px dashed red'
                                    : undefined,
                            }}
                            value={bindings[binding as keyof typeof BINDINGS_MAP].hotkey}
                        />
                        {isElectron() && (
                            <Checkbox
                                checked={bindings[binding as keyof typeof BINDINGS_MAP].isGlobal}
                                disabled={
                                    bindings[binding as keyof typeof BINDINGS_MAP].hotkey === ''
                                }
                                onChange={(e) =>
                                    handleSetGlobalHotkey(binding as BindingActions, e)
                                }
                                size="md"
                                style={{
                                    opacity: bindings[binding as keyof typeof BINDINGS_MAP]
                                        .allowGlobal
                                        ? 1
                                        : 0,
                                }}
                            />
                        )}
                        {bindings[binding as keyof typeof BINDINGS_MAP].hotkey && (
                            <ActionIcon
                                icon="x"
                                iconProps={{
                                    color: 'error',
                                }}
                                onClick={() => handleClearHotkey(binding as BindingActions)}
                                variant="transparent"
                            />
                        )}
                    </Group>
                ))}
            </div>
        </>
    );
};
