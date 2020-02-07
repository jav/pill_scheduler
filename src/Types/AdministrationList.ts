import moment from 'moment';
import Administration from './Administration';
import { substanceDB, SubstanceKey } from './Substance';

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

    totalMg(substance: SubstanceKey) {
        return this.administrationList
            .filter((a) => a.pill.activeSubstance === substance)
            .reduce((acc, a) => acc + a.dose, 0);

    }

    addAdministration(adm: Administration) {
        this.administrationList.push(adm);
        this.administrationList.sort(
            (a: Administration, b: Administration) => b.time.getTime() - a.time.getTime()
        )
        return this;
    }

    getLatestAdministration() {
        return this.administrationList[0];
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
            this.administrationList.filter((a) => a.pill.isNSAID())
        )
    }

    onlyParacetamol() {
        return new AdministrationList(
            this.administrationList.filter((a) => a.pill.isParacetamol())
        )
    }

    filterOnSubstance(substance: SubstanceKey) {
        return new AdministrationList(
            this.administrationList.filter((a) => a.pill.activeSubstance === substance)
        );
    }

    getEffectAtTime(time, category: string): number {
        if (!['nsaid', 'paracetamol'].includes(category.toLowerCase()))
            throw Error("getEffectAtTime() category must be either 'NSAID' or 'Paracetamol'.");
        const filteredList = category.toLowerCase() == 'nsaid' ? this.onlyNSAID() : this.onlyParacetamol();
        const effectPerAdministrationList = filteredList.administrationList.map((a)=>a.pill.getEffectAtTime(a.time, time));
        const effectSum = effectPerAdministrationList.reduce((acc, e)=> acc+e);
        return effectSum;
    }


}

export default AdministrationList;