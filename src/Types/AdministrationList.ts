import Pill from './Pill';
import Administration from './Administration';

class AdministrationList {
    administrationList: Administration[]

    constructor(_administrationList?: AdministrationList | Administration[]) {
        this.administrationList = [];
        if (typeof _administrationList !== 'undefined') {
            if (Array.isArray(_administrationList)) {
                this.administrationList = _administrationList;
            }
            else {
                this.administrationList = _administrationList.administrationList;
            }
        }
    }

    length() {
        return this.administrationList.length;
    }

    // Gets an interval from time (open) to time (closed)
    getInterval(from: Date, to: Date) {
        if (from > to) {
            let tmpDate;
            tmpDate = from;
            from = to;
            to = tmpDate;
        }
        return new AdministrationList(
            this.administrationList.filter(
                (a) => from < a.time && a.time <= to
            )
        );
    }
}

export default AdministrationList;