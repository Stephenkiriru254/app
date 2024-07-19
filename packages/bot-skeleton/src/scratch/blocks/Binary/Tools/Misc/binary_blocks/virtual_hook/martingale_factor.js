import { localize } from '@deriv/translations';

Blockly.Blocks.martingale = {
    init() {
        this.jsonInit({
            message0: localize('Martingale Factor {{ input_martingale }}', { input_martingale: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'MARTINGALE',
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
            MARTINGALE: null,
        };
    },
};

Blockly.JavaScript.martingale = () => {};
