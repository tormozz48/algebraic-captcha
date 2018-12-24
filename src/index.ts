import {Config} from './config';
import {IParams} from './i-params';

export class AlgebraicCaptcha {
    private config: Config;

    constructor(params: IParams) {
        this.config = new Config(params);
    }
}
