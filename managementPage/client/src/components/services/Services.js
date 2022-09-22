import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import {GoogleOAuthProvider} from '@react-oauth/google';
import {MyGoogleAuth} from "./MyGoogleAuth";

let isSideOpen = true;

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined
        }
        this.clientId = '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com'

        this.saveProfile = this.saveProfile.bind(this)
        this.deleteProfile = this.deleteProfile.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        fetch("/profile/" + this.props.restaurantId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(Object.keys(data).includes('email')){
                    this.setState({
                        profile: data
                    })
                }
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

    handleSideBarChange(){
        let sideBar = document.querySelector("#sidebarDiv");
        let main = document.querySelector("#mainContentContainer");
        if(isSideOpen){
            sideBar.removeAttribute("style");
            main.setAttribute("style", "marginLeft: 0");
            isSideOpen = false;
        } else {
            sideBar.setAttribute("style", "display: block;");
            main.setAttribute("style", "marginLeft: 250px");
            isSideOpen = true;
        }
    }

    render() {
        return (
            <>
            <button className='openbtn' onClick={this.handleSideBarChange}>&#9776;</button>
            <div>
                <GoogleOAuthProvider clientId={this.clientId}>
                    <MyGoogleAuth
                        onLogin={this.saveProfile}
                        profile={this.state.profile}
                        restaurantId={this.props.restaurantId}
                        onLogout={this.deleteProfile}/>
                </GoogleOAuthProvider>
            </div>
            </>
        );
    }

}