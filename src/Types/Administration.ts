import { Pill } from './Pill'
import uuid from 'react-native-uuid';

class Administration {
    time: Date;
    pill: Pill;
    dose: number;
    uuid: string;

    constructor(time: Date, pill: Pill, dose: number, _uuid: null | string) {
        this.time = new Date(time);
        this.pill = pill;
        this.dose = dose;
        if (_uuid == null) this.uuid = uuid.v4();
        else this.uuid = _uuid;
    }

}

export default Administration;
