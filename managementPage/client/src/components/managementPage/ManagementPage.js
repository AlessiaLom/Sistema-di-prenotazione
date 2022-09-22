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
            restaurantId: '0001',
            profile: undefined
        }
        this.saveProfile = this.saveProfile.bind(this)
        this.deleteProfile = this.deleteProfile.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
    }

    /**
     * Used to fetch user's google profile if existing in db
     */
    componentDidMount() {
        fetch("/profile/" + this.state.restaurantId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    profile: data
                })
            })
    }

    saveProfile(profile) {
        this.setState({
            profile: profile
        })
    }

    deleteProfile() {
        this.setState({
            profile: undefined
        })
    }

    handleAuthentication(profile) {
        this.setState({
            profile: profile
        })
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
                        <Route path="/" element={<Customize restaurantId={this.state.restaurantId}/>}/>
                        <Route path="/customize" element={<Customize restaurantId={this.state.restaurantId}/>}/>
                        <Route path="/activities" element={<Activities restaurantId={this.state.restaurantId}/>}/>
                        <Route path="/bookings" element={<Bookings restaurantId={this.state.restaurantId}/>}/>
                        <Route path="/services" element={<Services
                            onLogout={this.deleteProfile}
                            profile={this.state.profile}
                            onLogin={this.saveProfile}
                            restaurantId={this.state.restaurantId}/>}/>
                        <Route path="/account" element={<p>Ciao mondo</p>}/>
                    </Routes>

                </div>
            </div>
        )
    }
}