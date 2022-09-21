import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import "./../../styles/pages.css"
import {useGoogleLogin} from '@react-oauth/google';
import {FcGoogle} from 'react-icons/fc'

function MyGoogleLogin(props) {
    const login = useGoogleLogin({
        onSuccess: codeResponse => sendCode(codeResponse),
        flow: 'auth-code',
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/spreadsheets",
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
                .then((data) => {
                    console.log(data)
                    props.onLogin(data)
                })
        }
    }

    const logout = () => {
        // delete tokens entry in db by restaurantId
        props.onLogout()
    }

    let buttonContent = props.profile ? "Logged in as " + props.profile.email : "Log in with Google"
    return (
        <div>
            <button
                type="button"
                className="btn btn-light googleLoginButton"
                onClick={() => login()}
                disabled={props.profile}>
                <table className='googleLoginButton'>
                    <td className='googleLoginButton'>
                        <FcGoogle size={40}/>
                    </td>
                    <td className='googleLoginButton'>
                        {buttonContent}
                    </td>
                </table>
            </button>
            <button
                type="button"
                className="btn btn-dark"
                onClick={() => logout()}
                hidden={!props.profile}>
                Log out
            </button>
        </div>
);
}

export
    {
        MyGoogleLogin
    }