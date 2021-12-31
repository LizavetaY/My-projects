import { sumAimsBudget } from '../../../helpers/tools.js';
import { getDataToday } from '../../../helpers/tools.js';

import Component from '../../component.js';

import Error404 from '../error404.js';

import Trips from '../../../models/trips.js';
import TripAdd from '../trips/trip-add.js';

class Tripedit extends Component {
    constructor() {
        super();

        this.trip = this.trips.find(trip => trip.tripid === this.request.tripid);
    }

    render() {
        return new Promise(resolve => {
            let html;

            if (this.trip) {
                const { tripid, country, tripdatafrom, tripdatato, tripbudget, tripstatus, tripaims } = this.trip;

                html = `
                    <div class="trip-wrapper">
                        <h1 class="trip-title">Edit Trip Info</h1>
                        <div class="buttons trip-info-buttons">
                            <button class="addTripButton trip-button">Save Trip</button>
                            <a id="gohomeTripButton" class="trip-button" href="#/trip/${tripid}">Back to Info</a>
                        </div>
                        <div class="trip-info">
                            <table class="trip-info-table">
                                <tbody>
                                    <tr>
                                        <td>Country to trip:</td>
                                        <td>${country}</td>
                                        <td colspan="3" class="budget-title">Trip budget:</td>
                                    </tr>
                                    <tr>
                                        <td>Trip status:</td>
                                        <td>${tripstatus}</td>
                                        <td class="budget-td">planned</td>
                                        <td class="budget-td">expenses</td>
                                        <td class="budget-td">balance</td>
                                    </tr>
                                    <tr>
                                        <td>From:</td>
                                        <td><input type="date" class="dataFrom" min="${getDataToday()}" value="${tripdatafrom}"></td>
                                        <td rowspan="2" class="budget">$ <input type="text" class="tripBudget tripBudget-input" value="${tripbudget}"></td>
                                        <td rowspan="2" class="budget">$ ${sumAimsBudget(tripaims)}</td>
                                        <td rowspan="2" class="budget">$ ${tripbudget - sumAimsBudget(tripaims)}</td>
                                    </tr>
                                    <tr>
                                        <td>Till:</td>
                                        <td><input type="date" class="dataTill" min="${getDataToday()}" value="${tripdatato}"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
				`;
            } else {
                html = new Error404().render();
            }

            resolve(html);
        });
    }

    afterRender() {
        this.trip && this.setActions();
    }

    setActions() {
        const editTripDataFrom = document.getElementsByClassName('dataFrom')[0],
            editTripDataTill = document.getElementsByClassName('dataTill')[0],
            editTripBudget = document.getElementsByClassName('tripBudget')[0],
            saveTripBtn = document.getElementsByClassName('addTripButton')[0];

        new TripAdd().checkEnteredData();

        saveTripBtn.addEventListener('click', () => this.editTrip(editTripDataFrom, editTripDataTill, editTripBudget));
    }

    editTrip(editTripDataFrom, editTripDataTill, editTripBudget) {
        this.trip.tripdatafrom = editTripDataFrom.value;
        this.trip.tripdatato = editTripDataTill.value;
        this.trip.tripbudget = editTripBudget.value.trim();
        Trips.setTripsToLS(this.trips);

        this.redirectToTripInfo();
    }

    redirectToTripInfo() {
        location.hash = `#/trip/${this.trip.tripid}`;
    }
}

export default Tripedit;