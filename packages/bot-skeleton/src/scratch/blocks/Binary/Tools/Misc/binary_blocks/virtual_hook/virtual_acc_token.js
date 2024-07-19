import { localize } from '@deriv/translations';

Blockly.Blocks.virtual_token = {
    init() {
        this.jsonInit({
            message0: localize('Virtual Account Token {{ input_virtual_token }}', { input_virtual_token: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VIRTUAL_TOKEN',
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
            VIRTUAL_TOKEN: null,
        };
    },
};

Blockly.JavaScript.virtual_token = () => {};
