import Component from '../component.js';

class About extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <div class="about-wrapper">
                    <h1 class="about-title">About "My journey journal"</h1>
                    <p>This app is created for people who like travel and want to manage their preparations for making a big
                        journey!</p>
                    <ul>
                        <li>There you can count all countries you've been or you want to visit</li>
                        <li>Is your trip soon? Don't worry. You can mark it in the calendar and see how many days left</li>
                        <li>Also you can make a TODO list to not forget all the necessary things</li>
                    </ul>
                    <p>Enjoy this app!</p>
                </div>
            `);
        });
    }
}

export default About;