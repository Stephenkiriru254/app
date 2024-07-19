import { localize } from '@deriv/translations';
import { config } from '../../../../../../../constants';
import { api_base2 } from '../../../../../../../services/api/api-base';
import { notify } from '../../../../../../../services/tradeEngine/utils/broadcast';

Blockly.Blocks.enable_virtual_hook = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize(
                'Enable/Disable VH {{ barrier_active_type }}',
                {
                    barrier_active_type: '%1',
                }
            ),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'ENABLE_VIRTUAL_HOOK',
                    options: config.lists.BARRIER_OFFSETER_STATUS,
                },
            ],
            colour: Blockly.Colours.Special3.colour,
            colourSecondary: Blockly.Colours.Special3.colourSecondary,
            colourTertiary: Blockly.Colours.Special3.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Enable and Disable Virtual Hook'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            display_name: localize('Virtual Hook Enabler'),
            description: localize(
                'This block displays Enable and Disable Virtual Hook.'
            ),
        };
    },
};

Blockly.JavaScript.enable_virtual_hook = block => {
    const vh_status = block.getFieldValue('ENABLE_VIRTUAL_HOOK');
    authorizeAccount('AdDA8jU7lRadRwH');
    const code = `Bot.enabaleVH('${vh_status}')`;
    return code;
};

export const authorizeAccount = async token => {
    try {
        if (!config.vh_variables.is_authorized) {
            const response = await api_base2.authorize_3(token);

            if (response.authorize) {
                config.vh_variables.is_authorized = true;
                notify('success', 'Virtual Hook Authorized');
            } else {
                console.error('Authorization failed:', response.error);
            }
        } else {
            notify('success', 'Virtual Hook Already Authorized');
        }
    } catch (error) {
        notify('error', error.toString());
    }
};

