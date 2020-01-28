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
    getInterval(_from: Date, _to: Date) {
        if (_from > _to) {
            let tmpDate;
            tmpDate = _from;
            _from = _to;
            _to = tmpDate;
        }
        return new AdministrationList(
            this.administrationList.filter(
                (a) => _from < a.time && a.time <= _to
            )
        );
    }

    onlyNSAID() {
        return new AdministrationList(
            this.administrationList.filter((a)=>a.pill.isNSAID())
        )
    }

    onlyParacetamol() {
        return new AdministrationList(
            this.administrationList.filter((a)=>a.pill.isParacetamol())
        )
    }

}

export default AdministrationList;