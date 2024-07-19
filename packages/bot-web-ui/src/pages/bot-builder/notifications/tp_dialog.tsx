import React from 'react';
import { Dialog, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { config } from '@deriv/bot-skeleton';

type TakeProfitDialogType = {
    setShowTPDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const TakeProfitDialog = ({setShowTPDialog}: TakeProfitDialogType) => {
    const closeDialog = () => {
        setShowTPDialog(false);
        config.show_notifications.show_tp = false;
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
                    {localize("Congratulations🎉🎉")}
                </Text>
                <div data-testid='data-close-button' onClick={() => closeDialog()} tabIndex={0}>
                    <Icon icon='IcCross' />
                </div>
            </div>
            <Text as='p' align='left' size='xs' color='prominent'>
                {localize(
                    'The bot has hit your take profit'
                )}
            </Text>
        </Dialog>
    );
};

export default TakeProfitDialog;
