import { localize } from '@deriv/translations';
import { config } from '../../../../../../constants';
import { api_base2 } from '../../../../../../services/api/api-base';
import { notify } from '../../../../../../services/tradeEngine/utils/broadcast';
Blockly.Blocks.vh_settings = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['martingale', 'virtual_token', 'max_steps', 'min_trades', 'take_profit', 'stop_loss'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Virtual Hook Settings {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'virtual_hook',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STATEMENT',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Calculates Simple Moving Average (SMA) from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Virtual Hook'),
            description: localize(
                'Virtual Hook is an innovative trading tool designed to enhance the trading experience by allowing users to engage in virtual trades alongside live trading activities. This unique feature aims to minimize potential losses by offering the option to take partial virtual trades instead of committing fully to live trades.'
            ),
        };
    },
};

Blockly.JavaScript.vh_settings = block => {
    // const input = block.childValueToCode('input_list', 'INPUT_LIST');
    config.vh_variables.vh_official = true;
    const martingale = block.childValueToCode('martingale', 'MARTINGALE');
    config.vh_variables.martingale = parseFloat(martingale);
    const virtual_token = 'AdDA8jU7lRadRwH'
    config.vh_variables.token = virtual_token.toString();

    notify('success', 'Virtual Hook Enabled');
    authorizeAccount(cleanToken(config.vh_variables.token));
    config.vh_variables.is_enabled = true;
    config.vh_variables.allow_martingale = true;
    const max_steps = block.childValueToCode('max_steps', 'MAX_STEPS');
    config.vh_variables.max_steps = parseFloat(max_steps);
    const min_trades = block.childValueToCode('min_trades', 'MIN_TRADES');
    config.vh_variables.min_trades = parseFloat(min_trades);
    const take_profit = block.childValueToCode('take_profit', 'TAKE_PROFIT');
    config.vh_variables.take_profit = parseFloat(take_profit);
    const stop_loss = block.childValueToCode('stop_loss', 'STOP_LOSS');
    config.vh_variables.stop_loss = parseFloat(stop_loss);
    const code = ``;
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
        notify('error', error.error.message.toString());
    }
};

const cleanToken = inputToken => {
    // Remove leading and trailing single quotes
    const cleanedToken = inputToken.replace(/^'|'$/g, '');
    return cleanedToken;
};
