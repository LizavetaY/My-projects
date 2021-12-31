import { generateID } from '../helpers/utils.js';
import Aims from './aims.js';

class Trips {
    constructor() {
        this.defaultTrips = [
            {
                tripid: generateID(),
                country: 'DE',
                tripdatafrom: '2022-12-12',
                tripdatato: '2022-02-02',
                tripbudget: 500,
                tripstatus: 'Open',
                tripaims: new Aims().getAimsFromLS()
            },
            {
                tripid: generateID(),
                country: 'NO',
                tripdatafrom: '2022-07-03',
                tripdatato: '2022-10-09',
                tripbudget: 600,
                tripstatus: 'Open',
                tripaims: new Aims().getAimsFromLS()
            }
        ];
    }

    getTripsFromLS() {
        return JSON.parse(localStorage.getItem('trips')) || this.defaultTrips && Trips.setTripsToLS(this.defaultTrips);
    }

    static setTripsToLS(trips) {
        localStorage.setItem('trips', JSON.stringify(trips));
    }
}

export default Trips;