import { localize } from '@deriv/translations';

Blockly.Blocks.take_profit = {
    init() {
        this.jsonInit({
            message0: localize('Take Profit {{ input_take_profit }}', { input_take_profit: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TAKE_PROFIT',
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
            TAKE_PROFIT: null,
        };
    },
};

Blockly.JavaScript.take_profit = () => {};
