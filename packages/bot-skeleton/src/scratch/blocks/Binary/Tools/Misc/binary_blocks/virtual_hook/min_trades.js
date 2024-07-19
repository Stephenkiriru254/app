import { localize } from '@deriv/translations';

Blockly.Blocks.min_trades = {
    init() {
        this.jsonInit({
            message0: localize('Min. Trades on Real {{ input_min_trades }}', { input_min_trades: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'MIN_TRADES',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange: Blockly.Blocks.input_list.onchange,
    getRequiredValueInputs() {
        return {
            MIN_TRADES: null,
        };
    },
};

Blockly.JavaScript.min_trades = () => {};
