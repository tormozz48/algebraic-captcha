const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const handlebars = require('handlebars');
const {AlgebraicCaptcha} = require('../build/index');

const templateStr = fs.readFileSync(path.join(__dirname, './template.hbs'), {encoding: 'utf-8'});
const template = handlebars.compile(templateStr);

(async () => {
    try {
        fs.mkdirSync(path.join(__dirname, 'images'));
    } catch (error) {}

    const data = await Promise.mapSeries(getConfigurations(), async ({name, config}) => {
        const algebraicCaptcha = new AlgebraicCaptcha(config);
        const {image, answer} = await algebraicCaptcha.generateCaptcha();
        const imageName = `${_.kebabCase(_.toLower(name))}.png`;
        const imagePath = path.join(__dirname, 'images', imageName);

        fs.writeFileSync(imagePath, image);

        return {
            name,
            config: JSON.stringify(config, null, 4),
            answer,
            imagePath: `images/${imageName}`
        };
    });

    fs.writeFileSync(
        path.join(__dirname, 'index.html'),
        template({rows: _.chunk(data, 3)}),
        {encoding: 'utf-8'}
    );

    console.info('success');
})();

function getConfigurations() {
    return [
        {
            name: 'Default',
            config: {}
        },
        {
            name: 'Custom background',
            config: {
                background: '#336699'
            }
        },
        {
            name: 'Custom color',
            config: {
                color: '#11ff11'
            }
        },
        {
            name: 'Custom operand range',
            config: {
                minValue: 10,
                maxValue: 15
            }
        },
        {
            name: 'Custom operations amount',
            config: {
                operandAmount: 2
            }
        },
        {
            name: 'Use only plus operand',
            config: {
                operandAmount: 2,
                operandTypes: ['+']
            }
        },
        {
            name: 'Use multiply operation',
            config: {
                operandTypes: ['*']
            }
        },
        {
            name: 'Mode "equation"',
            config: {
                mode: 'equation'
            }
        }
    ];
}