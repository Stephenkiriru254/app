import { localize } from '@deriv/translations';

Blockly.Blocks.set_sl = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Stop Loss'),
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            tooltip: localize('stop loss'),
        };
    },
    meta() {
        return {
            display_name: localize('Stop Loss'),
            description: localize(
                'Your bot is stopped automatically when your profit is less than or equals to your set stop loss.'
            ),
            key_words: localize('stoploss'),
        };
    },
};

Blockly.JavaScript.set_sl = () => {
    const code = `
        Bot.showSL();
    `;

    return code;
};