import {WritableStreamBuffer} from 'stream-buffers';
import {Config} from './config';
import {FormulaBuilder} from './formula-builder';
import {FormulaDrawer} from './formula-drawer';
import {IParams} from './i-params';
import {IFormula} from './i-formula';

export class AlgebraicCaptcha {
    private readonly INITIAL_BUFFER_SIZE: number = 100 * 1024;
    private readonly INCREMENT_BUFFER_SIZE: number = 10 * 1024;

    private config: Config;
    private formulaBuilder: FormulaBuilder;
    private formulaDrawer: FormulaDrawer;

    constructor(params: IParams) {
        this.config = new Config(params);
        this.formulaBuilder = new FormulaBuilder(this.config);
        this.formulaDrawer = new FormulaDrawer(this.config);
    }

    public async generateCaptcha(): Promise<{image: Buffer; answer: number}> {
        const generatedFormula: IFormula = this.formulaBuilder.generateFormula();

        const formula: string[] = generatedFormula.formula;
        const answer: number = generatedFormula.answer;

        const image = await this.formulaDrawer.draw(formula);
        const streamBuffer = new WritableStreamBuffer({
            initialSize: this.INITIAL_BUFFER_SIZE,
            incrementAmount: this.INCREMENT_BUFFER_SIZE
        });

        await this.formulaDrawer.getPNGBuffer(image, streamBuffer);

        return {image: streamBuffer.getContents(), answer};
    }
}
