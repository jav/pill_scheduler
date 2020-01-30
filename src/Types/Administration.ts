import { Pill } from './Pill'

class Administration {
    time: Date;
    pill: Pill;
    dose: number;

    constructor(time: Date, pill: Pill, dose: number) {
        this.time = new Date(time);
        this.pill = pill;
        this.dose = dose;
    }
}

export default Administration;
