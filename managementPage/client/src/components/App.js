import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/management.css"
import "./../styles/sideBar.css"
import SideBar from './sidebar/SideBar';
import Activities from './activities/Activities';
import Customize from './customize/Customize';
import Bookings from './bookings/Bookings';
import Services from './services/Services';
/**
 * The App component will contain the two main sections: the sidebar and the main content
 * The App component will be the one responible also for the change of the content shown in the page.
 */
export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            restaurantId: '0001',
            activeItemIndex: 0,
            profile: null
        }
        this.changeContent = this.changeContent.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
    }

    /**
     * saves the index of the currently active menuItem in order to change the content of the page and to highlight the right menuItem in the sideBar
     * @param {int} i index of the selected menuItem (from top to bottom)
     */
    changeContent(i) {
        // console.log("" + this.state.activeItemIndex)
        this.setState({
            activeItemIndex: i,
            customize: <Customize />
        })
        // console.log("" + this.state.activeItemIndex)
    }

    handleAuthentication(profile) {
        this.setState({
            profile: profile
        })
    }

    render() {
        /**
         * The contentShown will change based on the active menuItem option
         * 0 - Personalizzazione (Customize component)
         * 1 - Attività (Activities component)
         * 2 - Prenotazioni
         * 3 - Servizi
         * 4 - Account
         */
        let contentShown
        switch (this.state.activeItemIndex) {
            case 0:
                contentShown = <><Customize restaurantId={this.state.restaurantId}/></>
                break;
            case 1:
                contentShown = <><Activities restaurantId={this.state.restaurantId}/></>
                break
            case 2:
                contentShown = <Bookings restaurantId={this.state.restaurantId}/>
                break;
            case 3: 
                contentShown =
                    <Services
                        restaurantId={this.state.restaurantId}
                        onLog={this.handleAuthentication}
                        profile={this.state.profile} />
                break;
            default:
                contentShown = <p>Ciao mondo</p>
                break;
        }

        /**
         * Renders the SideBar and the main content container that will show the right page
         */
        return (
            <div id="containerDiv" className="row g-0 p-3">
                <div id="sidebarDiv" className="col-3 shadow p-3 bg-body rounded">
                    <SideBar onClick={this.changeContent} activeItemIndex={this.state.activeItemIndex} />
                </div>
                <div id="mainContentContainer" className="col shadow p-3 bg-body rounded">
                    {contentShown}
                </div>
            </div>
        )
    }
}