import {Config} from './config';
import {FormulaBuilder} from './formula-builder';
import {FormulaDrawerSVG} from './formula-drawer-svg';
import {IFormula} from './i-formula';
import {IParams} from './i-params';

export class AlgebraicCaptcha {
    private config: Config;
    private formulaBuilder: FormulaBuilder;
    private formulaDrawer: FormulaDrawerSVG;

    constructor(params: IParams) {
        this.config = new Config(params);
        this.formulaBuilder = new FormulaBuilder(this.config);
        this.formulaDrawer = new FormulaDrawerSVG(this.config);
    }

    public async generateCaptcha(): Promise<{image: string; answer: number}> {
        const generatedFormula: IFormula = this.formulaBuilder.generateFormula();

        const formula: string[] = generatedFormula.formula;
        const answer: number = generatedFormula.answer;

        const image = await this.formulaDrawer.draw(formula);
        return {image, answer};
    }
}
