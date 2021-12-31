import Component from '../../views/component.js';

import { setCountriesListToLS } from '../../helpers/countrieslist.js';
import { getCountriesListToLS } from '../../helpers/countrieslist.js';

import WorldMap from '../../models/worldmap.js';

import Trips from '../../models/trips.js';
import TripAdd from '../pages/trips/trip-add.js';

class MainPage extends Component {
    render() {
        setCountriesListToLS();

        return new Promise(resolve => {
            let html;

            resolve(`
                <div id="mapBlock" class="map-conteiner"></div>
                <div class="info-wrapper">
                    <div class="countriesCounter">
                        <p>There are <span class="countriesAll"></span> countries</p>
                        <p>You've visited <span class="countriesVisited"></span> countries</p>
                        <p>You've planned to visit <span class="countriesPlanned"></span> countries</p>
                        <p>There are <span class="countriesLeft">2</span> countries left</p>
                    </div>
                    <div class="countriesJournal">
                        <div class="journalBlock nearestTrips">
                            <h2 class="nearestTrips-title">Nearest ${this.getFiveNearestTrips().length} ${this.getFiveNearestTrips().length !== 1 ? 'Trips' : 'Trip'}</h2>
                            <div class="tripsBlockWrapper">
                                ${this.getFiveNearestTrips().map(trip => this.getTripHTML(trip)).join('\n ')}
                            </div>
                            <div class="buttons">
                                <button id="seeMoreButton" class="seeMore-disabled trip-button" disabled>No trips
                                    yet</button>
                            </div>
                        </div>
                        <div class="journalBlock aimsList">
                            <h2>Trip Aims</h2>
                            <div class="aimsBlockWrapper">CLICK on the Trip to see Aims</div>
                            <div class="buttons"></div>
                        </div>
                        <div class="journalBlock calendar">
                            <table id="calendar">
                                <thead>
                                    <tr><td>‹<td colspan="5"><td>›
                                    <tr><td>Пн<td>Вт<td>Ср<td>Чт<td>Пт<td>Сб<td>Вс
                                <tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    afterRender() {
        new WorldMap().drawWorldMap();
        this.setActions();
        this.makeCalendar();
        this.checkBtnStatus();
        this.sortTripsByDates();
    }

    setActions() {
        const tripBlockContainer = document.getElementsByClassName('tripsBlockWrapper')[0];

        tripBlockContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('tripBlock'):
                case targetClassList.contains('trip-info'):
                case targetClassList.contains('trip-info-data'):
                case targetClassList.contains('trip-info-buttons'):
                    this.showTripAims(target.dataset.tripid);
                    break;

                case targetClassList.contains('delete_trip-button'):
                case targetClassList.contains('delete_trip-img'):
                    let countryName = this.getFiveNearestTrips().filter(el => el.tripid == target.dataset.tripid)[0].country;
                    const worldMapConteiner = document.getElementById('mapBlock'),
                        nearestTripsTitle = document.getElementsByClassName('nearestTrips-title')[0];

                    if (new TripAdd().removeTrip(countryName)) {
                        new WorldMap().removeCountry(countryName);
                        worldMapConteiner.innerHTML = '';
                        new WorldMap().drawWorldMap();
                        this.checkBtnStatus();
                        this.makeCalendar();
                        nearestTripsTitle.innerHTML = `Nearest ${this.getFiveNearestTrips().length} ${this.getFiveNearestTrips().length !== 1 ? 'Trips' : 'Trip'}`;
                    }
                    break;
            }
        });
    }

    showTripAims(tripid) {
        const tripAimsConteiner = document.getElementsByClassName('aimsBlockWrapper')[0];

        let trip = this.getFiveNearestTrips().find(el => {
            if (el.tripid == tripid) return el
        });
        let aimsList = '';

        trip.tripaims.map(el => aimsList += this.getTripAimsHTML(trip, el)).join('\n ');
        tripAimsConteiner.innerHTML = aimsList;
    }

    findTripsDates() {
        return new Trips().getTripsFromLS().map(el => {
            return {
                tripid: el.tripid,
                country: el.country,
                year: el.tripdatafrom.split('-')[0],
                month: el.tripdatafrom.split('-')[1],
                day: el.tripdatafrom.split('-')[2],
                tripdatafrom: el.tripdatafrom,
                tripdatato: el.tripdatato,
                tripaims: el.tripaims
            }
        })
    }

    sortTripsByDates() {
        return this.findTripsDates().sort((el1, el2) => {
            if (new Date(el1) < new Date(el2)) return -1;
            return 0
        })
    }

    getFiveNearestTrips() {
        const arrFiveTrips = [];

        for (let i = 0; i < 5; i++) {
            if (this.sortTripsByDates()[i] !== undefined) arrFiveTrips.push(this.sortTripsByDates()[i])
        }

        return arrFiveTrips
    }

    checkBtnStatus() {
        const seeMoreBtn = document.getElementById('seeMoreButton');

        function redirectToTripsInfo() {
            location.hash = `#/trips`;
        }

        if (this.getFiveNearestTrips().length > 0) {
            seeMoreBtn.innerText = 'See More';
            seeMoreBtn.removeAttribute('disabled');
            seeMoreBtn.classList.remove('seeMore-disabled');
            seeMoreBtn.onclick = () => {
                redirectToTripsInfo();
            };
        } else {
            seeMoreBtn.innerText = 'No trips yet';
            seeMoreBtn.setAttribute('disabled', '');
            seeMoreBtn.classList.add('seeMore-disabled');
        }
    }

    getTripHTML(trip) {
        return `
            <div class="tripBlock" data-tripid="${trip.tripid}">
                <div class="trip-info" data-tripid="${trip.tripid}">
                    <p class="trip-info-data" data-tripid="${trip.tripid}">Country: ${getCountriesListToLS()[trip.country]} (${trip.country})</p>
                    <p class="trip-info-data" data-tripid="${trip.tripid}">From: ${trip.tripdatafrom.split('-').reverse().join('-')}</p>
                    <p class="trip-info-data" data-tripid="${trip.tripid}">Till: ${trip.tripdatato.split('-').reverse().join('-')}</p>
                </div>
                <div class="buttons trip-info-buttons" data-tripid="${trip.tripid}">
                    <a class="trip-button" href="#/trip/${trip.tripid}"><img
                        src="frontend/images/icons/svg/more.svg" alt="SeeMore icon"></a>
                    <a class="trip-button" href="#/trip/${trip.tripid}/edit"><img
                        src="frontend/images/icons/svg/edit.svg" alt="Edit icon"></a>
                    <a class="trip-button delete_trip-button" data-tripid="${trip.tripid}"><img src="frontend/images/icons/svg/delete.svg"
                        alt="Delete icon" class="delete_trip-img" data-tripid="${trip.tripid}"></a>
                </div>
            </div>
        `;
    }

    getTripAimsHTML(trip, aim) {
        return `
            <div class="aimBlock">
                <div class="trip-aims">
                    <p>Title: ${aim.title}</p>
                    <p>Status: ${aim.aimstatus}</p>
                    <p>Budget: $ ${aim.aimbudget}</p>
                </div>
                <div class="buttons trip-info-buttons">
                    <a class="trip-button" href="#/trip/${trip.tripid}"><img
                        src="frontend/images/icons/svg/more.svg" alt="SeeMore icon"></a>
                    <a class="trip-button" href="#/trip/${trip.tripid}/aim/${aim.aimid}"><img
                        src="frontend/images/icons/svg/edit.svg" alt="Edit icon"></a>
                    <a class="trip-button"><img src="frontend/images/icons/svg/delete.svg"
                        alt="Delete icon"></a>
                </div>
            </div>
        `;
    }

    makeCalendar() {
        const tripsDates = this.findTripsDates();

        function Calendar(id, year, month) {
            let Dlast = new Date(year, month + 1, 0).getDate(),
                D = new Date(year, month, Dlast),
                DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
                DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
                calendar = '<tr>',
                months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

            if (DNfirst != 0) {
                for (let i = 1; i < DNfirst; i++) calendar += '<td>';
            } else {
                for (let i = 0; i < 6; i++) calendar += '<td>';
            }

            const arrTripsDatas = [];

            for (let i = 1; i <= Dlast; i++) {
                const arrForCheckDatas = [];

                if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
                    calendar += '<td class="today" title="Today">' + i;
                    arrForCheckDatas.push(i);
                } else {
                    if (tripsDates.length > 0) {
                        tripsDates.forEach(el => {
                            if (+el.day === i && arrForCheckDatas.every(el => el !== i) && new Date(el.tripdatafrom).getMonth() === D.getMonth() && +el.year === D.getFullYear()) {
                                calendar += `<td class="trips" title="Trip to ${getCountriesListToLS()[el.country]}">` + i;
                                arrTripsDatas.push(i);
                                arrForCheckDatas.push(i);
                            }
                        })
                        if (arrTripsDatas.every(el => el !== i)) {
                            calendar += '<td>' + i;
                            arrForCheckDatas.push(i);
                        }
                    } else {
                        calendar += '<td>' + i;
                    }
                }
                if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
                    calendar += '<tr>';
                }
            }

            for (let i = DNlast; i < 7; i++) calendar += '<td>&nbsp;';

            document.querySelector('#' + id + ' tbody').innerHTML = calendar;
            document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = months[D.getMonth()] + ' ' + D.getFullYear();
            document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.months = D.getMonth();
            document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();

            if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) {
                document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
            }
        }

        Calendar("calendar", new Date().getFullYear(), new Date().getMonth());

        document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
            Calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.months) - 1);
        }

        document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
            Calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.months) + 1);
        }
    }
}

export default MainPage;