import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/sideBar.css"
import Cookies from 'universal-cookie';
 
const cookies = new Cookies();

/**
 * The Footer contains the Logout button on the sidebar
 */
export default class Footer extends React.Component {
    constructor(props) {
        super(props)
    }

    handleClick = () => {
        cookies.remove('login');
        window.location.reload();
    }

    render() {
        return (
            <div className="mx-auto align-items-center justify-content-center" id="footerDiv">
                <button type="button" onClick={this.handleClick} className="btn btn-outline-secondary logout">Logout</button>
            </div>
        )
    }
}