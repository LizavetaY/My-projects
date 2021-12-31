import Component from '../component.js';

class HeaderMain extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => {
            resolve(`
                <h1>My journey journal</h1>
                <nav class="journalPages">
                    <a class="header__link ${!resource ? 'active' : ''}" href="/#/">Home</a>
                    <a class="header__link ${resource === 'trips' ? 'active' : ''}" href="/#/trips">Planned trips</a>
                    <a class="header__link ${resource === 'about' ? 'active' : ''}" href="/#/about">About</a>
                </nav>
                <div id="dataToday"></div>
            `);
        });
    }
}

export default HeaderMain;