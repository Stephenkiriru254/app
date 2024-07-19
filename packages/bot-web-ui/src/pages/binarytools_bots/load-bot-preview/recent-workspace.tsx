import React from 'react';
import classnames from 'classnames';

import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import { DBOT_TABS } from 'Constants/bot-contents';
import { waitForDomElement } from 'Utils/dom-observer';
import { useDBotStore } from 'Stores/useDBotStore';
import { STRATEGY } from '../../../constants/dashboard';
import { useComponentVisibility } from '../../../hooks';
import {
    rudderstackDashboardChooseYourBot,
    rudderstackDashboardDeleteYourBot,
    rudderstackDashboardEditYourBot,
    rudderstackDashboardSaveYourBot,
} from '../analytics/rudderstack-dashboard';
import './index.scss';
import './style.css';

type TRecentWorkspace = {
    index: number;
    workspace: { [key: string]: string };
    updateBotName: (name: string) => void;
};

const RecentWorkspace = observer(({ workspace, index }: TRecentWorkspace) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard, load_modal, save_modal, toolbar } = useDBotStore();
    const { active_tab, setActiveTab, setPreviewOnDialog } = dashboard;
    const { toggleSaveModal, updateBotName } = save_modal;
    const {
        dashboard_strategies = [],
        getRecentFileIcon,
        getSaveType,
        getSelectedStrategyID,
        loadFileFromRecent,
        onToggleDeleteDialog,
        previewRecentStrategy,
        previewed_strategy_id,
        selected_strategy_id,
        setSelectedStrategyId,
        setPreviewedStrategyId,
    } = load_modal;
    const { loadCustomStrategy } = toolbar;
    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    const toggle_ref = React.useRef<HTMLButtonElement>(null);
    const is_div_triggered_once = React.useRef<boolean>(false);
    const visible = useComponentVisibility(toggle_ref);
    const { setDropdownVisibility, is_dropdown_visible } = visible;
    const is_desktop = isDesktop();

    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const select_first_strategy = dashboard_strategies?.length && index === 0 && !is_div_triggered_once.current;

        if (select_first_strategy) {
            timer = setTimeout(() => {
                is_div_triggered_once.current = true;
                trigger_div_ref?.current?.click();
            }, 50);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, index]);

    const onToggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setDropdownVisibility(!is_dropdown_visible);
        setSelectedStrategyId(workspace.id);
    };

    const handleInit = () => {
        setPreviewedStrategyId(workspace?.id);
        // Fires for desktop
        if (active_tab === 0 || active_tab === 2) {
            previewRecentStrategy(workspace.id);
        }
    };

    const handlePreviewList = () => {
        setPreviewedStrategyId(workspace.id);
        // Fires for mobile on clicking preview button
        if (is_mobile) {
            setPreviewOnDialog(true);
            const dashboard_tab_dom_element = document.getElementsByClassName('tab__dashboard')?.[0];
            waitForDomElement('#load-strategy__blockly-container', dashboard_tab_dom_element).then(() => {
                previewRecentStrategy(workspace.id);
            });
        }
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'open',
            form_source: 'bot_dashboard_form-open',
        });
    };

    const handleOpenBot = async () => {
        await loadCustomStrategy(index);
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    };

    const handleEdit = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'close',
            form_source: 'bot_dashboard_form-edit',
        });
    };

    const handleSave = () => {
        updateBotName(workspace?.name);
        toggleSaveModal();
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);

        switch (type) {
            case STRATEGY.INIT:
                // Fires for desktop preview
                handleInit();
                rudderstackDashboardChooseYourBot({
                    bot_name: workspace?.name,
                    bot_last_modified_time: dashboard_strategies?.[0]?.timestamp,
                });
                break;

            case STRATEGY.PREVIEW_LIST:
                // Fires for mobile preview
                handlePreviewList();
                rudderstackDashboardChooseYourBot({
                    bot_name: workspace?.name,
                    bot_last_modified_time: dashboard_strategies?.[0]?.timestamp,
                });
                break;

            case STRATEGY.EDIT:
                await handleEdit();
                rudderstackDashboardEditYourBot({
                    bot_name: workspace?.name,
                });
                break;

            case STRATEGY.SAVE:
                handleSave();
                rudderstackDashboardSaveYourBot({
                    bot_name: workspace?.name,
                    bot_last_modified_time: dashboard_strategies?.[0]?.timestamp,
                    bot_status: dashboard_strategies?.[0]?.save_type,
                });
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
                rudderstackDashboardDeleteYourBot({
                    bot_name: workspace?.name,
                    delete_popup_respond: 'yes',
                });
                break;

            default:
                break;
        }
    };

    const is_active_mobile = selected_strategy_id === workspace.id && is_dropdown_visible;
    const text_size = is_desktop ? 'xs' : 'xxs';

    return (
        <div
            className={classnames('binarytools-list__item ', {
                'binarytools-list__item --selected': previewed_strategy_id === workspace.id,
                'binarytools-list__item --loaded': dashboard_strategies,
                'binarytools-list__item --min': !!dashboard_strategies?.length && !is_desktop,
            })}
            key={workspace.id}
            onClick={e => {
                // // getSelectedStrategyID(workspace.id);
                e.stopPropagation();
                handleOpenBot();
            }}
        >
            <div className='binarytools-list__item__label'>
                <div className='text-wrapper' title={workspace.name}>
                    <div className='name_text'>{workspace.name}</div>
                </div>
            </div>
        </div>
    );
});

export default RecentWorkspace;
