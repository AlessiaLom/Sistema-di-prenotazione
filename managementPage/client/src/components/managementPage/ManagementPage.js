import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import {Route, Routes} from 'react-router-dom'
import "./../../styles/management.css"
import "./../../styles/sideBar.css"
import SideBar from './../sidebar/SideBar';
import Activities from './../activities/Activities';
import Customize from './../customize/Customize';
import Bookings from './../bookings/Bookings';
import Services from './../services/Services';

/**
 * The App component will contain the two main sections: the sidebar and the main content
 * The App component will be the one responsible also for the change of the content shown in the page.
 */
export default class ManagementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeItemIndex: 0,
        }
        this.changeContent = this.changeContent.bind(this)
    }

    /**
     * saves the index of the currently active menuItem in order to change the content of the page and to highlight the right menuItem in the sideBar
     * @param {int} i index of the selected menuItem (from top to bottom)
     */
    changeContent(i) {
        // console.log("" + this.state.activeItemIndex)
        this.setState({
            activeItemIndex: i,
        })
        // console.log("" + this.state.activeItemIndex)
    }

    render() {

        return (
            <div id="containerDiv" className="row g-0 p-3">
                <div id="sidebarDiv" className="col-3 shadow p-3 bg-body rounded">
                    <SideBar onLogout={this.props.onLogout} onClick={this.changeContent}
                             activeItemIndex={this.state.activeItemIndex}/>
                </div>
                <div id="mainContentContainer" className="col shadow p-3 bg-body rounded">
                    <Routes>
                        <Route path="/" element={<Customize restaurantId={this.props.restaurantId}/>}/>
                        <Route path="/customize" element={<Customize restaurantId={this.props.restaurantId}/>}/>
                        <Route path="/activities" element={<Activities restaurantId={this.props.restaurantId}/>}/>
                        <Route path="/bookings" element={<Bookings restaurantId={this.props.restaurantId}/>}/>
                        <Route path="/services" element={<Services restaurantId={this.props.restaurantId}/>}/>
                        <Route path="/account" element={<p>Ciao mondo</p>}/>
                    </Routes>

                </div>
            </div>
        )
    }
}