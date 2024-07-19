import React from 'react';
import { FaRegPlusSquare, FaTrash } from 'react-icons/fa';
import { observer, useStore } from '@deriv/stores';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import {
    api_base,
    removeCopyTradingTokens,
    updateCopyTradingTokens,
    reCallTheTokens,
    retrieveListItem,
    saveListItemToStorage,
    deleteItemFromStorage,
    config,
    addCtProgramTokens,
    removeCtToken,
    tokenExists,
    getToken,
} from '@deriv/bot-skeleton';
import './style.css';

const CopyTrading = observer(() => {
    const store = useStore();
    const {
        ui: { is_dark_mode_on },
    } = store;
    const { run_panel, dashboard } = useDBotStore();
    const [tokens, setTokens] = React.useState<string[]>([]);
    const [tokenInputValue, setTokenInputValue] = React.useState<string>('');
    const [animatingIds, setAnimatingIds] = React.useState<string[]>([]);
    const [tokenType, setTokenType] = React.useState('');
    const [shouldShowError, setShouldShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [wasTokens, setWasTokens] = React.useState(false);
    const [enableCP, setEnableCP] = React.useState(false);
    const [enableDC, setEnableDC] = React.useState(false);
    const [syncing, setSyncing] = React.useState(false);
    const [ctProgram, setCtProgram] = React.useState(false);
    const [allowedCTProgram, setAllowedCTProgram] = React.useState(false);
    const [liveAccounts, setLiveAccounts] = React.useState<string[]>([]);
    const [isAPIStored, setIsAPIStored] = React.useState(false);
    const allowedCopyTrading = React.useRef(false);
    const [selectedAccount, setSelectedAccount] = React.useState<string>('');
    const masterToken = React.useRef('6kWudRwICFwwTMa');

    React.useEffect(() => {
        getSavedTokens();
        tokenExists(getToken().account_id).then(exists => {
            if (exists) {
                allowedCopyTrading.current = true;
                setAllowedCTProgram(true);
            } else {
                allowedCopyTrading.current = false;
                setAllowedCTProgram(false);
            }
        });

        if (typeof localStorage !== 'undefined') {
            const client_accounts = JSON.parse(localStorage.getItem('client.accounts')!) || undefined;
            const filteredAccountKeys = Object.keys(client_accounts).filter(key => key.startsWith('CR'));
            setLiveAccounts(filteredAccountKeys);
            if (filteredAccountKeys.length > 0) {
                setSelectedAccount(filteredAccountKeys[0]);
                config.copy_trading.active_CR = filteredAccountKeys[0];
            }
        }
    }, []);

    React.useEffect(() => {
        getSavedTokens();
    }, [is_dark_mode_on]);

    React.useEffect(() => {
        if (api_base.api && !isAPIStored) {
            setIsAPIStored(true);
            const subscription = api_base.api.onMessage().subscribe(({ data }: { data: any }) => {
                if (data.msg_type === 'copy_start') {
                    const { copy_start } = data;
                    if (copy_start == 1) {
                        allowedCopyTrading.current = true;
                        setAllowedCTProgram(true);
                        addCtProgramTokens([getToken().account_id]);
                    }
                }

                if (data.msg_type === 'copy_stop') {
                    const { copy_stop } = data;
                    if (copy_stop == 1) {
                        allowedCopyTrading.current = false;
                        setAllowedCTProgram(false);
                        removeCtToken(getToken().account_id);
                    }
                }
            });

            api_base.pushSubscription(subscription);
        }
    }, [api_base.api]);

    const getSavedTokens = async () => {
        retrieveListItem().then(list_item => {
            const login_id = getToken().account_id!;
            if (login_id.includes('VRTC')) {
                setTokenType('Demo Tokens');
            } else if (login_id.includes('CR')) {
                setTokenType('Live Tokens');
            }

            if (list_item !== undefined && list_item !== null) {
                const cleanList = Array.isArray(list_item[0]) ? list_item[0] : list_item;
                if (cleanList.length > 0) {
                    setTokens(cleanList as string[]);
                    setWasTokens(true);
                } else {
                    setTokens([]);
                }
            } else {
                setTokens([]);
            }
        });
    };

    const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenInputValue(event.target.value);
    };

    const handleLiveAccountsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAccount(event.target.value);
        config.copy_trading.active_CR = event.target.value;
    };

    const addToken = async () => {
        if (getToken().account_id) {
            try {
                const newToken = tokenInputValue.trim();
                const response = await updateCopyTradingTokens(tokenInputValue.trim());

                if (response === 'VRTC' || response === 'CR') {
                    saveListItemToStorage(newToken);
                    tokens.unshift(newToken);
                } else {
                    setErrorMessage(response!);
                    setShouldShowError(true);
                }
            } catch (error: any) {
                if (typeof error.error !== 'undefined') {
                    setErrorMessage(error.error.message);
                    setShouldShowError(true);
                }
            } finally {
                setTokenInputValue('');
            }
        } else {
            setErrorMessage(
                localize("It seems you haven't logged in, please login in and try adding the token again.")
            );
            setShouldShowError(true);
        }
    };

    const deleteToken = (token: string) => {
        removeCopyTradingTokens(token).then(() => {
            deleteItemFromStorage(token);
            handleSyncData(true).then(() => {
                setAnimatingIds((prevIds: any) => [...prevIds, token]);
            });
        });
    };

    const handleTransitionEnd = (check_token: string) => {
        setTokens(tokens.filter(token => token !== check_token));
        setAnimatingIds((prevIds: any) => prevIds.filter((i: any) => i !== check_token));
    };

    const handleShouldShowError = () => {
        setShouldShowError(false);
        setCtProgram(!ctProgram);
    };

    const handleCPChange = () => {
        setEnableCP(!enableCP);
        config.copy_trading.is_active = !enableCP;
    };
    const handleDCChange = () => {
        setEnableDC(!enableDC);
        config.copy_trading.allow_demo_copy = !enableDC;
    };

    const handleSyncData = async (isSubsync: boolean) => {
        if (!isSubsync) {
            setSyncing(true);
        }
        const login_id = getToken().account_id!;
        const new_tokens = await reCallTheTokens();
        if (typeof new_tokens !== 'undefined') {
            setTokens(new_tokens);
        } else {
            setTokens([]);
        }

        if (login_id.includes('VRTC')) {
            setTokenType('Demo Tokens');
        } else if (login_id.includes('CR')) {
            setTokenType('Live Tokens');
        }
        if (!isSubsync) {
            setSyncing(false);
        }
    };

    return (
        <div className='main_copy'>
            {shouldShowError && (
                <Dialog
                    title={localize('Error while adding new token!')}
                    confirm_button_text={localize('OK')}
                    onConfirm={handleShouldShowError}
                    is_visible={shouldShowError}
                >
                    {errorMessage}
                </Dialog>
            )}

            {ctProgram && (
                <Dialog
                    title={localize('Join Binarytool CopyTrading Program')}
                    confirm_button_text={localize('Close')}
                    onConfirm={handleShouldShowError}
                    is_visible={ctProgram}
                >
                    <div className={`input_content ${is_dark_mode_on && 'dark_active'}`}>
                        <button
                            onClick={() => {
                                if (!allowedCopyTrading.current) {
                                    api_base.api.send({
                                        copy_start: masterToken.current,
                                    });
                                } else {
                                    api_base.api.send({
                                        copy_stop: masterToken.current,
                                    });
                                }
                            }}
                            style={{ marginTop: '10px', borderRadius: '2px', fontSize: '16px' }}
                        >
                            {!allowedCTProgram ? 'Start Copying my trades' : 'Stop Copying my trades'}
                        </button>
                    </div>
                </Dialog>
            )}
            <div className='ena_DC'>
                <div className='enable_disable'>
                    <label className="switch">
                        <input
                            type='checkbox'
                            checked={config.copy_trading.allow_demo_copy}
                            onChange={handleDCChange}
                        />
                        <span className="slider round"></span>
                    </label>
                    <Localize i18n_default_text='Enable Demo to Real Copy Trading' />
                </div>
                {enableDC && (
                    <select value={selectedAccount} onChange={handleLiveAccountsChange}>
                        {liveAccounts.map(key => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <header className={`title ${is_dark_mode_on && 'dark_active'}`}>
                <h1>{localize('Add Tokens to your Copy Trading List')}</h1>
            </header>

            {/* <div className='create-token-btn'>
                <button
                    style={{
                        marginTop: ' 4px',
                        backgroundColor: '#ff444f',
                        color: '#fff',
                        border: 'none',
                        padding: '4px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setCtProgram(!ctProgram);
                    }}
                >
                    
                </button>
                <a href='https://app.deriv.com/account/api-token' target='_blank'>
                    <button
                        style={{
                            backgroundColor: '#04AA6D',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        CREATE API TOKEN
                    </button>
                </a>
            </div> */}
            <div className={`input_content ${is_dark_mode_on && 'dark_active'}`}>
                <div>
                    <input type='text' value={tokenInputValue} onChange={handleTokenInputChange} />
                    <button onClick={() => addToken()}>
                        <FaRegPlusSquare />
                    </button>
                </div>

                <div className='enable_sync'>
                    <div className='enable_disable'>
                        <label className="switch">
                            <input
                                type='checkbox'
                                checked={config.copy_trading.is_active}
                                onChange={handleCPChange}
                            />
                            <span className="slider round"></span>
                        </label>
                        <Localize i18n_default_text='Enable CP' />
                    </div>
                    <div className='sync_data'>
                        <button onClick={() => handleSyncData(false)}>{syncing ? 'Syncing...' : 'Sync'}</button>
                    </div>
                </div>

            </div>
            <div className='tokens-container'>
                <ul className='tokens-list'>
                    {tokens.length > 0 ? (
                        tokens.map((token, index) => (
                            <li
                                key={token}
                                className={`token ${animatingIds.includes(token) ? 'fall' : ''}`}
                                onTransitionEnd={() => handleTransitionEnd(token)}
                            >
                                <span className='token-item'>
                                    {index + 1}. {token}
                                </span>
                                <button className='trash-btn' onClick={() => deleteToken(token)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className={`token_info ${is_dark_mode_on && 'dark_active'}`}>
                            {localize('No tokens available, add new tokens')}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
});

export default CopyTrading;
