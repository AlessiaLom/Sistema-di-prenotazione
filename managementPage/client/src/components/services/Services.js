import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import "./../../styles/pages.css"
import {GoogleOAuthProvider} from '@react-oauth/google';
import {MyGoogleLogin} from "./MyGoogleLogin";

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.clientId = '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com'
    }

    render() {
        return (
            <div>
                <GoogleOAuthProvider clientId={this.clientId}>
                    <MyGoogleLogin
                        onLogin={this.props.onLogin}
                        profile={this.props.profile}
                        restaurantId={this.props.restaurantId}
                        onLogout={this.props.onLogout}/>
                </GoogleOAuthProvider>
            </div>
        );
    }

}