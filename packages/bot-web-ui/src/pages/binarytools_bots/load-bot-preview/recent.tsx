import React from 'react';
import { MobileWrapper, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import RecentWorkspace from './recent-workspace';
import SaveModal from './save-modal';
import { binarytools_bot_list } from '@deriv/bot-skeleton';
import './index.scss';

type THeader = {
    label: string;
    className: string;
};

const HEADERS: THeader[] = [
    {
        label: localize('Binarytool Bot'),
        className: 'bot-list__header__label',
    },
];

const RecentComponent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [binarytools_bots, setbinarytoolsBots] = React.useState(binarytools_bot_list);

    if (!binarytools_bots?.length) return null;
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div className='load-strategy__recent'>
                <div className='load-strategy__recent__files'>
                    <div className='load-strategy__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Binarytool Bots:' />
                        </Text>
                    </div>
                    <div className='binarytools-list__wrapper'>
                        {binarytools_bots.map((workspace, index) => {
                            return (
                                <RecentWorkspace
                                    key={workspace.id}
                                    workspace={{ name: workspace.name }}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                    <MobileWrapper>
                        <SaveModal />
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
});

export default RecentComponent;
