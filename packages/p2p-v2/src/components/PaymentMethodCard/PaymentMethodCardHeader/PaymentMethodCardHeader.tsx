import React, { ComponentType, SVGAttributes } from 'react';
import { TAdvertiserPaymentMethods } from 'types';
import { FlyoutMenu } from '@/components';
import { LabelPairedEllipsisVerticalXlRegularIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import IcCashierBankTransfer from '../../../public/ic-cashier-bank-transfer.svg';
import IcCashierEwallet from '../../../public/ic-cashier-ewallet.svg';
import IcCashierOther from '../../../public/ic-cashier-other.svg';
import './PaymentMethodCardHeader.scss';

type TPaymentMethodCardHeaderProps = {
    isEditable?: boolean;
    isSelectable?: boolean;
    medium?: boolean;
    onDeletePaymentMethod: () => void;
    onEditPaymentMethod: () => void;
    small?: boolean;
    type: NonNullable<TAdvertiserPaymentMethods>[number]['type'];
};

const PaymentMethodCardHeader = ({
    isEditable = false,
    isSelectable = false,
    medium = false,
    onDeletePaymentMethod,
    onEditPaymentMethod,
    small = false,
    type,
}: TPaymentMethodCardHeaderProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>> = IcCashierOther;
    if (type === 'bank') {
        Icon = IcCashierBankTransfer;
    } else if (type === 'ewallet') {
        Icon = IcCashierEwallet;
    }
    // TODO: Remember to translate these
    const flyoutMenuItems = [
        <Button color='black' key={0} onClick={onEditPaymentMethod} size='xs' textSize='xs' variant='ghost'>
            Edit
        </Button>,

        <Button color='black' key={1} onClick={onDeletePaymentMethod} size='xs' textSize='xs' variant='ghost'>
            Delete
        </Button>,
    ];
    return (
        <div className='p2p-v2-payment-method-card__header' data-testid='dt_p2p_v2_payment_method_card_header'>
            <Icon
                className='p2p-v2-payment-method-card__icon'
                data-testid='dt_p2p_v2_payment_method_card_header_icon'
                height={medium || small ? 16 : 24}
                width={medium || small ? 16 : 24}
            />
            {isEditable && (
                <FlyoutMenu
                    listItems={flyoutMenuItems}
                    renderIcon={() => <LabelPairedEllipsisVerticalXlRegularIcon />}
                />
            )}
            {/*TODO: wire up logic for the selectable payment method cards here*/}
            {isSelectable && <input data-testid='p2p_v2_payment_method_card_header_checkbox' type='checkbox' />}
        </div>
    );
};

export default PaymentMethodCardHeader;
