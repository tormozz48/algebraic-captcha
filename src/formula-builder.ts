import {random, sample, isNumber} from 'lodash';
import {IFormula} from './i-formula';
import {Config} from './config';

export class FormulaBuilder {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public generateFormula(): IFormula {
        const formulaChunks: string[] = this.generateFormulaChunks();
        const answer: number = new Function(`return ${formulaChunks.join(' ')}`)();
        const formula: string[] = formulaChunks.concat('=').concat(this.config.targetSymbol);

        return this.config.isFormulaMode()
            ? this.makeFormula(formula, answer)
            : this.makeEquation(formula, answer);
    }

    private generateFormulaChunks(): string[] {
        const {minValue, maxValue, operandAmount, operandTypes} = this.config;

        const formulaParts: string[] = [];

        let index: number = 0;
        while (index < 2 * operandAmount + 1) {
            index % 2 === 0
                ? formulaParts.push(random(minValue, maxValue).toString())
                : formulaParts.push(sample(operandTypes));
            index++;
        }

        return formulaParts;
    }

    /**
     * Returns formula in classic presentation
     * @example 5 + 1 = ?
     * @param {String[]} formula
     * @param {Number} answer
     * @returns {Object}
     * @private
     */
    private makeFormula(formula: string[], answer: number): IFormula {
        return <IFormula>{formula, answer};
    }

    /**
     * Returns formula in equation presentation
     * @example 5 + ? = 6
     * @param {String[]} formula
     * @param {Number} answer
     * @returns {IFormula}
     * @private
     */
    private makeEquation(formula: string[], answer: number): IFormula {
        const operands: number[] = formula
            .slice(0, formula.length - 2)
            .filter((item: string, index: number) => index % 2 === 0)
            .map(Number);

        const target: number = sample(operands);
        const targetIndex: number = formula.indexOf(target.toString());

        formula[targetIndex] = this.config.targetSymbol;
        formula[formula.length - 1] = answer.toString();
        answer = target;

        return <IFormula>{formula, answer};
    }
}
