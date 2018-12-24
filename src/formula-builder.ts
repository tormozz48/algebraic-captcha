import {sample, random} from 'lodash';
import {Config} from './config';

export class FormulaBuilder {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public generateFormula(): {formula: string[], answer: number} {
        const {minValue, maxValue, operandAmount, operandTypes} = this.config;

        const formulaParts: string[] = [];

        let index: number = 0;
        while(index < 2 * operandAmount + 1) {
            if (index % 2 === 0) {
                formulaParts.push(random(minValue, maxValue).toString());
            } else {
                formulaParts.push(sample(operandTypes));
            }
            index++;
        }

        const answer: number = (new Function(`return ${formulaParts.join(' ')}`))();
        const formula: string[] = formulaParts.concat('=').concat('?');

        return {formula, answer}
    }
}