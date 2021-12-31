import { generateID } from '../../../helpers/utils.js';
import { sumAimsBudget } from '../../../helpers/tools.js';

import Component from '../../component.js';

import Trips from '../../../models/trips.js';

class TripsList extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`    
                <div class="trip-wrapper">
                    <h1 class="trip-title">Trip Info</h1>
                    <div class="buttons trip-info-buttons">
                        <a id="gohomeTripButton" class="trip-button" href="#/">Home Page</a>
                        <button id="removeTripsButton" class="trip-button">Remove all Trips</button>
                    </div>
                    <div class="trip-info">
                        ${this.trips.map(trip => this.getTripHTML(trip)).join('\n ')}
                    </div>
                </div>          
            `);
        });
    }

    getTripHTML(trip) {
        return `
            <div class="trip-block" data-id="${trip.tripid}">
                <div class="buttons trip-info-buttons">
                    <a id="moreTripButton" class="trip-button" href="#/trip/${trip.tripid}">Show More</a>
                    <a id="editTripButton" class="trip-button" href="#/trip/${trip.tripid}/edit">Edit Trip</a>
                </div>
                <table class="trip-info-table">
                    <tbody>
                        <tr>
                            <td>Country to trip:</td>
                            <td>${trip.country}</td>
                            <td colspan="3" class="budget-title">Trip budget:</td>
                        </tr>
                        <tr>
                            <td>Trip status:</td>
                            <td>${trip.tripstatus}</td>
                            <td class="budget-td">planned</td>
                            <td class="budget-td">expenses</td>
                            <td class="budget-td">balance</td>
                        </tr>
                        <tr>
                            <td>From:</td>
                            <td>${trip.tripdatafrom.split('-').reverse().join('-')}</td>
                            <td rowspan="2" class="budget">$ ${trip.tripbudget}</td>
                            <td rowspan="2" class="budget">$ ${sumAimsBudget(trip.tripaims)}</td>
                            <td rowspan="2" class="budget">$ ${trip.tripbudget - sumAimsBudget(trip.tripaims)}</td>
                        </tr>
                        <tr>
                            <td>Till:</td>
                            <td>${trip.tripdatato.split('-').reverse().join('-')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

export default TripsList;