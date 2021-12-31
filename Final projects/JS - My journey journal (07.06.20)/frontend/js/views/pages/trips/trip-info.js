import { sumAimsBudget } from '../../../helpers/tools.js';

import Component from '../../component.js';

import Error404 from '../error404.js';

class TripInfo extends Component {
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
					<div class="trip-wrapper tripsBlockWrapper">
						<h1 class="trip-title">Trip Info</h1>
						<div class="buttons trip-info-buttons">
                            <a class="trip-button" href="#/trip/${tripid}/edit">Edit Trip</a>
                            <a class="trip-button delete_trip-button" data-tripid="${tripid}">Delete</a>
							<a class="trip-button" href="#/">Home Page</a>
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
                                <td>${tripdatafrom.split('-').reverse().join('-')}</td>
                                <td rowspan="2" class="budget">$ ${tripbudget}</td>
                                <td rowspan="2" class="budget">$ ${sumAimsBudget(tripaims)}</td>
                                <td rowspan="2" class="budget">$ ${tripbudget - sumAimsBudget(tripaims)}</td>
                            </tr>
                            <tr>
                                <td>Till:</td>
                                <td>${tripdatato.split('-').reverse().join('-')}</td>
                            </tr>
								</tbody>
							</table>
							<h2 class="aims-title">Trip Aims</h2>
							<div class="buttons trip-info-buttons">
								<button id="removeAimsButton" class="trip-button">Remove all Aims</button>
							</div>
							<div class="trip-aims">
								${tripaims.map(aim => this.getAimHTML(aim)).join('\n ')}
							</div>
                        </div>
					</div>
				`;
            } else {
                html = new Error404().render();
            }

            resolve(html);
        });
    }

    getAimHTML(aim) {
        return `
			<div class="aim-block" data-aimid="${aim.aimid}">
                <div class="buttons trip-aim-buttons">
					<a id="editAimButton" class="aim-button" href="#/trip/${this.trip.tripid}/aim/${aim.aimid}/edit">Edit Aim</a>
					<a id="doneAimButton" class="aim-button">Done</a>
                    <a id="deleteAimButton" class="aim-button">Delete Aim</a>
                </div>
                <table class="trip-aims-table">
                    <tbody>
                        <tr>
                            <td>Title</td>
                            <td>${aim.title}</td>
                            <td>Budget</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>${aim.aimstatus}</td>
                            <td>${aim.aimbudget}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td colspan="2">
                                <div class="aim-description">${aim.description}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}

export default TripInfo;