import { localize } from '@deriv/translations';

Blockly.Blocks.stop_loss = {
    init() {
        this.jsonInit({
            message0: localize('Stop Loss {{ input_stop_loss }}', { input_stop_loss: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'STOP_LOSS',
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
            STOP_LOSS: null,
        };
    },
};

Blockly.JavaScript.stop_loss = () => {};
