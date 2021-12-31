import { generateID } from '../../../helpers/utils.js';
import { getDataToday } from '../../../helpers/tools.js';

import Component from '../../component.js';

import Trips from '../../../models/trips.js';
import Aims from '../../../models/aims.js';
import MainPage from '../../../views/pages/mainpage.js';

class TripAdd extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`    
                <div class="trip-wrapper">
                    <h1 class="trip-title">Add a new Trip</h1>
                    <div class="buttons trip-info-buttons">
                        <a id="gohomeTripButton" class="trip-button">Home Page</a>
                    </div>
                    <div class="trip-info">
                        <div class="trip-block">
                            <table class="trip-info-table">
                                <tbody>
                                    <tr>
                                        <td>Country to trip:</td>
                                        <td>${this.addNewTrip()}</td>
                                        <td colspan="3" class="budget-title">Trip budget:</td>
                                    </tr>
                                    <tr>
                                        <td>Trip status:</td>
                                        <td>-</td>
                                        <td class="budget-td">planned</td>
                                        <td class="budget-td">expenses</td>
                                        <td class="budget-td">balance</td>
                                    </tr>
                                    <tr>
                                        <td>From:</td>
                                        <td><input type="date" class="dataFrom"
                                            min="${getDataToday()}">
                                        </td>
                                        <td rowspan="2" class="budget">$ <input type="text" class="tripBudget"
                                            class="tripBudget-input"></td>
                                        <td rowspan="2" class="budget">-</td>
                                        <td rowspan="2" class="budget">-</td>
                                    </tr>
                                    <tr>
                                        <td>Till:</td>
                                        <td>
                                            <input type="date" class="dataTill" min="${getDataToday()}">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="buttons trip-add-buttons">
                            <button class="addTripButton addTrip-disabled" disabled>Add a Trip</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addTripButton = document.getElementsByClassName('addTripButton')[0];

        this.checkEnteredData();

        addTripButton.addEventListener('click', () => this.addTrip(JSON.parse(localStorage.getItem('dataForNewTrip'))));
    }

    checkEnteredData() {
        const dataFromInput = document.getElementsByClassName('dataFrom')[0],
            dataTillInput = document.getElementsByClassName('dataTill')[0],
            budgetInput = document.getElementsByClassName('tripBudget')[0];

        const dataForNewTrip = {
            dataFrom: getDataToday(),
            dataTo: getDataToday(),
            budget: 0
        };

        if (localStorage.getItem('dataForNewTrip')) {
            dataFromInput.value = JSON.parse(localStorage.getItem('dataForNewTrip')).dataFrom || getDataToday();
            dataTillInput.value = JSON.parse(localStorage.getItem('dataForNewTrip')).dataTo;
            budgetInput.value = JSON.parse(localStorage.getItem('dataForNewTrip')).budget;
        }

        let valDataFrom = dataFromInput.value,
            valDataTo = dataTillInput.value,
            valBudget = +budgetInput.value.trim();

        dataFromInput.addEventListener('blur', () => {
            valDataFrom = dataFromInput.value;

            dataTillInput.setAttribute('min', valDataFrom);

            if (!this.isDataTillHigher(valDataFrom, valDataTo)) dataTillInput.value = valDataFrom;

            dataForNewTrip.dataFrom = valDataFrom;

            localStorage.setItem('dataForNewTrip', JSON.stringify(dataForNewTrip));

            (valDataFrom && valDataTo && valBudget !== 0) ? this.saveTripBtn() : this.dontSaveTripBtn();
        });

        dataTillInput.addEventListener('blur', () => {
            valDataTo = dataTillInput.value;
            dataTillInput.value = valDataTo;

            if (this.isDataTillHigher(valDataFrom, valDataTo)) dataForNewTrip.dataTo = valDataTo;

            localStorage.setItem('dataForNewTrip', JSON.stringify(dataForNewTrip));

            (valDataFrom && valDataTo && valBudget !== 0) ? this.saveTripBtn() : this.dontSaveTripBtn();
        });

        budgetInput.addEventListener('keyup', () => {
            valBudget = +budgetInput.value.trim();

            if (!valBudget || parseInt(valBudget)) dataForNewTrip.budget = valBudget;

            localStorage.setItem('dataForNewTrip', JSON.stringify(dataForNewTrip));

            (valDataFrom && valDataTo && valBudget !== 0 && parseInt(valBudget)) ? this.saveTripBtn() : this.dontSaveTripBtn();
        });
    }

    saveTripBtn() {
        const addTripButton = document.getElementsByClassName('addTripButton')[0];

        addTripButton.removeAttribute('disabled');
        addTripButton.classList.remove('addTrip-disabled');
        addTripButton.classList.add('aim-button');
    }

    dontSaveTripBtn() {
        const addTripButton = document.getElementsByClassName('addTripButton')[0];

        addTripButton.setAttribute('disabled', '');
        addTripButton.classList.add('addTrip-disabled');
        addTripButton.classList.remove('aim-button');
    }

    isDataTillHigher(valDataFrom, valDataTo) {
        return (new Date(valDataFrom) <= new Date(valDataTo));
    }

    addTrip(tripObj) {
        const newTrip = {
            tripid: generateID(),
            country: this.addNewTrip(),
            tripdatafrom: tripObj.dataFrom,
            tripdatato: tripObj.dataTo,
            tripbudget: tripObj.budget,
            tripstatus: 'Open',
            tripaims: new Aims().getAimsFromLS()
        };

        this.trips.push(newTrip);
        Trips.setTripsToLS(this.trips);

        alert('Your trip is successfully added');

        new MainPage().sortTripsByDates();

        this.redirectToTrips();
    }

    removeTrip(country) {
        const tripBlock = document.getElementsByClassName('tripsBlockWrapper')[0];

        if (confirm('Do you want to delete trip?')) {
            this.trips = this.trips.filter(trip => trip.country !== country);
            Trips.setTripsToLS(this.trips);
            tripBlock.innerHTML = new MainPage().getFiveNearestTrips().map(trip => new MainPage().getTripHTML(trip)).join('\n ');
            new MainPage().checkBtnStatus();
            return true;
        } else {
            return false
        }
    }

    redirectToTrips() {
        location.hash = `#/trips`;
    }

    addNewTrip() {
        let country = localStorage.getItem('countryName');
        this.redirectToTripAdd();
        return country
    };

    redirectToTripAdd() {
        location.hash = `#/addtrip`;
    };
}

export default TripAdd;