class Administration {
    time: Date;
    pill: string;

    constructor(time: Date, pill: string) {
        this.time = new Date(time);
        this.pill = pill;
    }
}

export default Administration;