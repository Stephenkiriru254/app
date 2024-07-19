import { localize } from '@deriv/translations';

Blockly.Blocks.enable_martingale = {
    init() {
        this.jsonInit({
            message0: localize('Enable Martingale {{ input_enable_martingale }}', { input_enable_martingale: '%1' }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'ENABLE_MARTINGALE',
                    options: [
                        [localize('true'), 'true'],
                        [localize('false'), 'false'],
                    ],
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
            ENABLE_MARTINGALE: null,
        };
    },
};

Blockly.JavaScript.enable_martingale = () => {};
