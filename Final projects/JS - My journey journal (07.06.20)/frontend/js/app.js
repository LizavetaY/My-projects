import { parseRequestURL } from './helpers/utils.js';

import HeaderMain from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import MainPage from './views/pages/mainpage.js';
import About from './views/pages/about.js';
import Error404 from './views/pages/error404.js';

import TripAdd from './views/pages/trips/trip-add.js';
import TripsList from './views/pages/trips/trips-list.js';
import TripInfo from './views/pages/trips/trip-info.js';
import TripEdit from './views/pages/trips/trip-edit.js';

const Routes = {
    '/': MainPage,
    '/about': About,
    '/addtrip': TripAdd,
    '/trips': TripsList,
    '/trip/:id': TripInfo,
    '/trip/:id/edit': TripEdit
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
        contentContainer = document.getElementsByClassName('content-container')[0],
        footerContainer = document.getElementsByClassName('footer-container')[0],
        header = new HeaderMain(),
        footer = new Footer();

    header.render().then(html => headerContainer.innerHTML = html);

    const request = parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.tripid ? '/:id' : ''}${request.action ? `/${request.action}` : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.render().then(html => {
        contentContainer.innerHTML = html;
        page.afterRender();
    });

    footer.render().then(html => footerContainer.innerHTML = html);
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);