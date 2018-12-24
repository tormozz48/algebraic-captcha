import * as path from 'path';
import {sample, isNumber, max} from 'lodash';
import * as PImage from 'pureimage';
import {Config} from './config';

export class FormulaDrawer {
    private readonly INITIAL_FONT_SIZE: number = 72;

    private config: Config;
    private fonts: any[];

    constructor(config: Config) {
        this.config = config;

        this.fonts = [
            PImage.registerFont(path.join(__dirname, '../assets/fonts/SourceSansPro-Regular.ttf'), 'Source Sans Pro')
        ]
    }

    public async draw(formula: string[]) {
        const {width, height} = this.config;

        return new Promise((resolve) => {
            const font = sample(this.fonts);
            font.load(() => {
                const img = PImage.make(width, height);
                const ctx = img.getContext('2d');

                ctx.fillStyle = this.config.background;
                ctx.fillRect(0, 0, width, height);

                const fLength: number = formula.length;
                const fMax:number = max(formula.map(Number).filter(isNumber));
                const fontSize:number = this.adjustFontSize(null, {ctx, font, fMax, fLength});

                ctx.font = `${fontSize}pt \'${font.family}\'`;
                ctx.fillStyle = this.config.color;
                ctx.textAlign = 'center';

                this.drawEqualtion(ctx, formula);

                resolve(img);
            })
        })
    }

    private drawEqualtion(ctx, formula: string[]) {
        const charLength: number = formula.length;
        const cellWidth: number = Math.floor(this.config.width / charLength);
        const cellHeight: number = this.config.height;

        formula.forEach((char: string, index: number) => {
            const metrics = ctx.measureText(char);
            const x: number = index * cellWidth + Math.floor((cellWidth - metrics.width) / 2);
            const y: number = Math.floor((cellHeight + metrics.emHeightAscent) / 2);
            ctx.fillText(char, x, y);
        })
    }

    private adjustFontSize(fontSize: null|number, params: {ctx, font, fMax: number, fLength: number}): number {
        const {ctx, font, fMax, fLength} = params;
        fontSize = fontSize || this.INITIAL_FONT_SIZE;
        ctx.font = `${fontSize}pt \'${font.family}\'`;

        const {width} = ctx.measureText(fMax.toString());
        if (width * fLength >= this.config.width) {
            return this.adjustFontSize(--fontSize, params);
        }

        return fontSize;
    }

    public getPNGBuffer(image, stream): Promise<Error|null> {
        return PImage.encodePNGToStream(image, stream);
    }
}