import AdministrationList from '../Types/AdministrationList';

import moment from 'moment'
import { SubstanceKey, substanceDB } from '../Types/Substance';

interface NextPillMap {
    [key: string]: Date
}

export const nextParacetamol = (paracetamolList: AdministrationList, currentTime: Date) => {
    /*
    Paracetamol
    Maximum 4g per 24h
    Maximum 1g per 4h
    */
    const paracetamol = substanceDB.getSubstanceByKey(SubstanceKey.PARACETAMOL);
    const last24hList = paracetamolList.onlyParacetamol().getInterval(moment(currentTime).subtract(24, 'hours').toDate(), currentTime)

    if (last24hList.length() === 0) return moment(0).toDate();

    const totalmg = last24hList.totalMg(SubstanceKey.PARACETAMOL);

    const oldestAdministration = last24hList.getLatestAdministration();
    if (totalmg >= paracetamol.maxDose24h) {
        return moment(oldestAdministration.time).add(24, 'hours').toDate();
    }

    const latestAdministration = last24hList.getLatestAdministration();

    return moment(latestAdministration.time).add(paracetamol.periodicity, 'hours').toDate();
}

export const nextNSAID = (NSAIDList: AdministrationList, currentTime: Date): NextPillMap => {
    /*
    NSAID
    Ibuprofen  400mg/6h 1200mg/24h
    Diklofenak 50mg/4h, 150mg/24h
    Acetylic acid 1000mg/4h 3000mg/24h
    */

    const acetylicAcid = substanceDB.getSubstanceByKey(SubstanceKey.ACETYLICACID);
    const diklofenak = substanceDB.getSubstanceByKey(SubstanceKey.DIKLOFENAK);
    const ibuprofen = substanceDB.getSubstanceByKey(SubstanceKey.IBUPROFEN);

    let retObj = {
        [SubstanceKey.ACETYLICACID]: moment(0).toDate(),
        [SubstanceKey.DIKLOFENAK]: moment(0).toDate(),
        [SubstanceKey.IBUPROFEN]: moment(0).toDate(),
    };

    const last24hList = NSAIDList.onlyNSAID().getInterval(moment(currentTime).subtract(24, 'hours').toDate(), currentTime)
    if (last24hList.length() === 0) {
        return retObj;
    }

    const latestAdministration = last24hList.getLatestAdministration();
    retObj = {
        [SubstanceKey.ACETYLICACID]: moment(latestAdministration.time).add(acetylicAcid.periodicity, 'millisecond').toDate(),
        [SubstanceKey.DIKLOFENAK]: moment(latestAdministration.time).add(diklofenak.periodicity, 'millisecond').toDate(),
        [SubstanceKey.IBUPROFEN]: moment(latestAdministration.time).add(ibuprofen.periodicity, 'millisecond').toDate(),
    };

    const totalmgAcetylicacid = last24hList.totalMg(SubstanceKey.ACETYLICACID);
    if (totalmgAcetylicacid > acetylicAcid.maxDose24h) {
        const latestAcetylicacidAdministration = last24hList.filterOnSubstance(SubstanceKey.ACETYLICACID).getLatestAdministration();
        retObj[SubstanceKey.ACETYLICACID] = moment.max(moment(retObj[SubstanceKey.ACETYLICACID]), moment(latestAcetylicacidAdministration.time).add(24, 'hours')).toDate()
    }
    const totalmgDiklofenak = last24hList.totalMg(SubstanceKey.DIKLOFENAK);
    if (totalmgDiklofenak > diklofenak.maxDose24h) {
        const latestDiklofenakAdministration = last24hList.filterOnSubstance(SubstanceKey.DIKLOFENAK).getLatestAdministration();
        retObj[SubstanceKey.DIKLOFENAK] = moment.max(moment(retObj[SubstanceKey.DIKLOFENAK]), moment(latestDiklofenakAdministration.time).add(24, 'hours')).toDate()
    }

    const totalmgIbuprofen = last24hList.totalMg(SubstanceKey.IBUPROFEN);
    if (totalmgIbuprofen > ibuprofen.maxDose24h) {
        const latestIbuprofenAdministration = last24hList.filterOnSubstance(SubstanceKey.IBUPROFEN).getLatestAdministration();
        retObj[SubstanceKey.IBUPROFEN] = moment.max(moment(retObj[SubstanceKey.IBUPROFEN]), moment(latestIbuprofenAdministration.time).add(24, 'hours')).toDate()
    }

    return retObj;
}
