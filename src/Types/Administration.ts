import Pill from './Pill'

class Administration {
    time: Date;
    pill: Pill;

    constructor(time: Date, pill: Pill) {
        this.time = new Date(time);
        this.pill = pill;
    }
}

export default Administration;
