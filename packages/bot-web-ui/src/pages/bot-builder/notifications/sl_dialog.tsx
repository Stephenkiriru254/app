import React from 'react';
import { Dialog, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { config } from '@deriv/bot-skeleton';

type StopLossDialogType = {
    setShowSLDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const StopLossDialog = ({setShowSLDialog}: StopLossDialogType) => {
    const closeDialog = () => {
        setShowSLDialog(false);
        config.show_notifications.show_sl = false;
    };
    return (
        <Dialog
            is_visible={true}
            is_mobile_full_width
            className={'dc-dialog bot-stopped-dialog'}
            confirm_button_text={localize('Back to Bot')}
            onConfirm={() => closeDialog()}
        >
            <div className='dc-dialog__content__header'>
                <Text data-testid='data-title' weight='bold' as='p' align='left' size='s' color='prominent'>
                    {localize('Alert⚠️⚠️')}
                </Text>
                <div data-testid='data-close-button' onClick={() => closeDialog()} tabIndex={0}>
                    <Icon icon='IcCross' />
                </div>
            </div>
            <Text as='p' align='left' size='xs' color='prominent'>
                {localize('The bot has hit your stop loss')}
            </Text>
        </Dialog>
    );
};

export default StopLossDialog;
