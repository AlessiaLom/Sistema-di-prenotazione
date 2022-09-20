import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import "./../../styles/pages.css"
import {useGoogleLogin} from '@react-oauth/google';

function MyGoogleLogin(props) {
    const login = useGoogleLogin({
        onSuccess: codeResponse => sendCode(codeResponse),
        flow: 'auth-code',
        scope: "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
        select_account: true
    });

    const sendCode = async (codeResponse) => {
        if (Object.keys(codeResponse).includes("code")) {
            console.log('success:', codeResponse);
            await fetch("/auth/google", {
                method: "POST",
                body: JSON.stringify({
                    code: codeResponse,
                    restaurantId: props.restaurantId // restaurant id used to store and retrieve access and refresh token in users_tokens.json
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => res.json())
                .then((data) => console.log(data))
        }
    }

    return (
        <div>
            <button onClick={() => login()}>
                Log in with google
            </button>
        </div>
    );
}

export {MyGoogleLogin}