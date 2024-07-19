import { localize } from '@deriv/translations';

Blockly.Blocks.max_steps = {
    init() {
        this.jsonInit({
            message0: localize('Max Steps {{ input_max_steps }}', { input_max_steps: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'MAX_STEPS',
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
            MAX_STEPS: null,
        };
    },
};

Blockly.JavaScript.max_steps = () => {};
