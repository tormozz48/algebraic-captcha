import {expect} from 'chai';
import {Config} from '../../src/config';
import {FormulaBuilder} from '../../src/formula-builder';

describe('src/formula-builder', () => {
    function generateFormula_(params = {}) {
        const config = new Config(params);
        const formulaBuilder = new FormulaBuilder(config);

        return formulaBuilder.generateFormula();
    }

    it('should generate formula for base configuration with default parameters', () => {
        const result = generateFormula_({});

        expect(result.answer).to.be.a('number');
        expect(result.formula).to.be.instanceof(Array);

        expect(result.formula).to.be.lengthOf(5);
    });

    it('should have valid answer for created equation', () => {
        const result = generateFormula_({});
        const answer = new Function(`return ${result.formula.slice(0, 3).join(' ')}`)();

        expect(answer).to.equal(result.answer);
    });

    it('should use given amount of operators', () => {
        const result = generateFormula_({operandAmount: 2});

        expect(result.formula).to.be.instanceof(Array);
        expect(result.formula).to.be.lengthOf(7);
    });

    it('should append "= ?" suffix to formula ending', () => {
        const result = generateFormula_({});

        const l = result.formula.length;
        expect(result.formula[l - 2]).to.equal('=');
        expect(result.formula[l - 1]).to.equal('?');
    });

    it('should limit used operands from bottom', () => {
        for (let i = 0; i < 50; i++) {
            const result = generateFormula_({minValue: 5});

            expect(Number(result.formula[0])).to.be.above(4);
            expect(Number(result.formula[2])).to.be.above(4);
        }
    });

    it('should limit used operands from top', () => {
        for (let i = 0; i < 50; i++) {
            const result = generateFormula_({maxValue: 7});

            expect(Number(result.formula[0])).to.be.below(8);
            expect(Number(result.formula[2])).to.be.below(8);
        }
    });

    it('should limit used operands from top and bottom', () => {
        for (let i = 0; i < 50; i++) {
            const result = generateFormula_({minValue: 3, maxValue: 7});

            expect(Number(result.formula[0])).to.be.below(8);
            expect(Number(result.formula[2])).to.be.below(8);

            expect(Number(result.formula[2])).to.be.above(2);
            expect(Number(result.formula[2])).to.be.above(2);
        }
    });

    it('should use only given operation types', () => {
        for (let i = 0; i < 20; i++) {
            const result = generateFormula_({operandTypes: ['+']});

            expect(result.formula.some((item) => item === '+')).to.equal(true);
            expect(result.formula.some((item) => item === '-')).to.equal(false);
        }
    });

    it('should use custom target symbol', () => {
        const result = generateFormula_({targetSymbol: 'x'});

        const formula = result.formula;
        const length = formula.length;
        const last = formula[length - 1];

        expect(last).to.equal('x');
    });

    it('should create equation in if "equation" mode enabled', () => {
        const result = generateFormula_({mode: 'equation'});

        const formula = result.formula;
        const length = formula.length;
        const last = formula[length - 1];

        expect(last).to.not.equal('?');
        expect(Number(last)).to.be.a('number');
        expect(formula.some((item) => item === '?')).to.equal(true);
    });
});
