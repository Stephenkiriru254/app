import React from 'react';
import { Tabs } from '@deriv/components';
import { localize } from '@deriv/translations';
import { WS, TContractStore, TContractInfo } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import ContractDetails from './contract-details';
import ContractHistory from './contract-history';

type TContractUpdateHistory = TContractStore['contract_update_history'];

type TContractAudit = Partial<
    Pick<ReturnType<typeof useTraderStore>, 'is_accumulator' | 'is_turbos' | 'is_multiplier' | 'is_vanilla'>
> & {
    contract_update_history: TContractUpdateHistory;
    contract_end_time: number | undefined;
    contract_info: TContractInfo;
    duration: string | number;
    duration_unit: string;
    exit_spot: string | undefined;
    is_dark_theme: boolean;
    is_open: boolean;
    toggleHistoryTab: (state_change?: boolean) => void;
};

type TResponse = {
    contract_update_history: TContractUpdateHistory;
};

const ContractAudit = ({
    contract_update_history,
    is_accumulator,
    is_multiplier,
    is_turbos,
    toggleHistoryTab,
    ...props
}: TContractAudit) => {
    const { contract_id, currency } = props.contract_info;
    const [update_history, setUpdateHistory] = React.useState<TContractUpdateHistory>([]);

    const getSortedUpdateHistory = (history: TContractUpdateHistory) =>
        history.sort((a, b) => Number(b?.order_date) - Number(a?.order_date));

    React.useEffect(() => {
        if (!!contract_update_history.length && contract_update_history.length > update_history.length)
            setUpdateHistory(getSortedUpdateHistory(contract_update_history));
    }, [contract_update_history, update_history]);

    const onTabItemClick = (tab_index: number) => {
        toggleHistoryTab(!!tab_index);
        if (tab_index) {
            WS.contractUpdateHistory(contract_id).then((response: TResponse) => {
                setUpdateHistory(getSortedUpdateHistory(response.contract_update_history));
            });
        }
    };

    if (!is_multiplier && !is_accumulator && !is_turbos) {
        return (
            <div className='contract-audit__wrapper'>
                <ContractDetails {...props} />
            </div>
        );
    }
    return (
        <div className='contract-audit__wrapper'>
            <Tabs top className='contract-audit__tabs' onTabItemClick={onTabItemClick}>
                <div label={localize('Details')}>
                    <ContractDetails {...props} />
                </div>
                <div label={localize('History')}>
                    <ContractHistory currency={currency} history={update_history} />
                </div>
            </Tabs>
        </div>
    );
};

export default ContractAudit;
