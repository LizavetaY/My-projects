class Countries {
    constructor() {
        this.defaultCountries = [
            {
                BY: 'visited',
                GB: 'planned'
            }
        ];
    }

    getCountriesFromLS() {
        return JSON.parse(localStorage.getItem('countries')) || this.defaultCountries && Countries.setCountriesToLS(this.defaultCountries);
    }

    static setCountriesToLS(countries) {
        localStorage.setItem('countries', JSON.stringify(countries));
    }
}

export default Countries;