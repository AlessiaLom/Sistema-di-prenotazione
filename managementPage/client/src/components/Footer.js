import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/sideBar.css"

/**
 * The Footer contains the Logout button on the sidebar
 */
export default class Footer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="mx-auto align-items-center justify-content-center" id="footerDiv">
                <button type="button" className="btn btn-outline-secondary logout">Logout</button>
            </div>
        )
    }
}