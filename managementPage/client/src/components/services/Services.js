import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import {GoogleOAuthProvider} from '@react-oauth/google';
import {MyGoogleLogin} from "./MyGoogleLogin";

let isSideOpen = true;

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.clientId = '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com'
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
                    <MyGoogleLogin
                        onLogin={this.props.onLogin}
                        profile={this.props.profile}
                        restaurantId={this.props.restaurantId}
                        onLogout={this.props.onLogout}/>
                </GoogleOAuthProvider>
            </div>
            </>
        );
    }

}