import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import "./../../styles/pages.css"
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import {MyGoogleLogin} from "./MyGoogleLogin";

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile
        }
        this.clientId = '504181834497-omrl5mnes3qmvvu39hu5v404lemlfq1c.apps.googleusercontent.com'
        // this.componentDidMount = this.componentDidMount.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.onFailure = this.onFailure.bind(this)
        this.logOut = this.logOut.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }


    componentDidMount() {
        /* const initClient = () => {
            gapi.client.init({
                clientId: this.clientId,
                scope: ["https://www.googleapis.com/auth/drive.metadata.readonly"]
            });
        };
        gapi.load('client:auth2', initClient); */
    }

    handleLogin = async (googleData) => {

    }

    onSuccess = async (data) => {
        if (Object.keys(data).includes("code")) {
            console.log('success:', data);
            const res = await fetch("/auth/google", {
                method: "POST",
                body: JSON.stringify({
                    code: data,
                    id: '0001' // restaurant id used to store and retrieve access and refresh token in users_tokens.json
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(res)
        } else {

        }
        /* this.setState({
            profile: googleData.profileObj
        }, () => {
            this.props.onLog(googleData.profileObj)
        }) */
    };

    onFailure = (err) => {
        console.log('failed:', err);
    };

    logOut = () => {
        this.setState({
            profile: null
        }, () => {
            this.props.onLog(null)
        })
    }

    render() {
        return (
            <div>
                <h2>React Google Login</h2>
                <br/>
                <br/>
                {/*<GoogleOAuthProvider clientId={this.clientId}>*/}
                {/*    <GoogleLogin*/}
                {/*        //clientId={this.clientId}*/}
                {/*        //buttonText="Log in with Google"*/}
                {/*        accessType="offline"*/}
                {/*        responseType="code"*/}
                {/*        //isSignedIn={true}*/}
                {/*        // fetchBasicProfile={true}*/}
                {/*        onSuccess={this.onSuccess}*/}
                {/*        //cookiePolicy={'single_host_origin'}*/}
                {/*        onFailure={this.onFailure}*/}
                {/*        scope="https://www.googleapis.com/auth/drive.metadata.readonly"*/}
                {/*    />*/}
                {/*</GoogleOAuthProvider>*/}

                <GoogleOAuthProvider clientId={this.clientId}>
                    <MyGoogleLogin/>
                </GoogleOAuthProvider>
            </div>
        );
    }

}