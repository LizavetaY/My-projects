import { generateID } from '../helpers/utils.js';

class Aims {
    constructor() {
        this.defaultAims = [
            {
                aimid: generateID(),
                title: 'Aim 1',
                description: '',
                aimbudget: 110,
                aimstatus: 'In Progress'
            },
            {
                aimid: generateID(),
                title: 'Aim 2',
                description: '',
                aimbudget: 20,
                aimstatus: 'In Progress'
            },
            {
                aimid: generateID(),
                title: 'Aim 3',
                description: '',
                aimbudget: 20,
                aimstatus: 'In Progress'
            }
        ];
    }

    getAimsFromLS() {
        if (localStorage.getItem('tasks') === 'undefined') {
            return JSON.parse(localStorage.getItem('tasks')).tripaims
        } else {
            return this.defaultAims
        }
    }
}

export default Aims;