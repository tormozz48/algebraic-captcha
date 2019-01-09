import * as path from 'path';
import {Config} from './config';

/* tslint:disable:no-var-requires*/
const svgCaptcha = require('svg-captcha');
/* tslint:enable:no-var-requires */

export class FormulaDrawerSVG {
    private config: Config;

    constructor(config: Config) {
        this.config = config;

        svgCaptcha.loadFont(path.join(__dirname, '../assets/fonts/SourceSansPro-Regular.ttf'));
    }

    public async draw(formula: string[]) {
        const {width, height, background, noise} = this.config;

        return svgCaptcha(formula.join(''), {width, height, background, noise});
    }
}
