import * as Joi from 'joi';
import {IParams} from './i-params';

export class Config {
    private _validated: IParams;

    public static readonly MODE_FORMULA: string = 'formula';
    public static readonly MODE_EQUATION: string = 'equation';

    constructor(params: IParams) {
        const result = Joi.validate(params, this.schema);

        if (result.error) {
            throw result.error;
        }

        this._validated = result.value;
    }

    public get width(): number {
        return this._validated.width;
    }

    public get height(): number {
        return this._validated.height;
    }

    public get background(): string {
        return this._validated.background;
    }

    public get color(): string {
        return this._validated.color;
    }

    public get minValue(): number {
        return this._validated.minValue;
    }

    public get maxValue(): number {
        return this._validated.maxValue;
    }

    public get operandAmount(): number {
        return this._validated.operandAmount;
    }

    public get operandTypes(): string[] {
        return this._validated.operandTypes;
    }

    public isFormulaMode(): boolean {
        return this._validated.mode === Config.MODE_FORMULA;
    }

    public get targetSymbol(): string {
        return this._validated.targetSymbol;
    }

    protected get schema(): object {
        const colorRegexp: RegExp = /^#([0-9a-f]{3}){1,2}$/i;

        return Joi.object({
            width: Joi.number()
                .integer()
                .min(20)
                .max(1000)
                .default(200),
            height: Joi.number()
                .integer()
                .min(20)
                .max(1000)
                .default(100),
            background: Joi.string()
                .min(3)
                .max(7)
                .trim()
                .regex(colorRegexp)
                .default('#ffffff'),
            color: Joi.string()
                .min(3)
                .max(7)
                .trim()
                .regex(colorRegexp)
                .default('#000000'),
            minValue: Joi.number()
                .integer()
                .min(1)
                .max(10000)
                .default(1),
            maxValue: Joi.number()
                .integer()
                .min(1)
                .max(10000)
                .default(10),
            operandAmount: Joi.number()
                .integer()
                .min(1)
                .max(5)
                .default(1),
            operandTypes: Joi.array()
                .items(Joi.string())
                .default(['+', '-']),
            mode: Joi.string()
                .valid([Config.MODE_FORMULA, Config.MODE_EQUATION])
                .default(Config.MODE_FORMULA),
            targetSymbol: Joi.string()
                .min(1)
                .max(3)
                .trim()
                .default('?')
        });
    }
}
