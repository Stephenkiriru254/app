import { localize } from '@deriv/translations';

Blockly.Blocks.set_tp = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Take Profit'),
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            tooltip: localize('take profit'),
        };
    },
    meta() {
        return {
            display_name: localize('Take Profit'),
            description: localize(
                'Your bot is stopped automatically when your profit is more than or equals to your set take profit.'
            ),
            key_words: localize('take profit'),
        };
    },
};

Blockly.JavaScript.set_tp = () => {
    const code = `
        Bot.showTP();
    `;

    return code;
};