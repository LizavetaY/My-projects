import { parseRequestURL } from '../helpers/utils.js';

import Trips from '../models/trips.js';

class Component {
    constructor() {
        this.request = parseRequestURL();
        this.trips = new Trips().getTripsFromLS();
    }

    afterRender() { }
}

export default Component;