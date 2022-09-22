import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/management.css"
import "./../styles/sideBar.css"
import Login from './login/Login';
import Cookies from 'universal-cookie';
import ManagementPage from "./managementPage/ManagementPage";

const cookies = new Cookies();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantId: '',
            logged: false
        }
        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
    }

    onLogout() {
        cookies.remove('login')
        this.setState({
            logged: false
        })
    }

    onLogin(restaurantId) {
        this.setState({
            restaurantId: restaurantId,
            logged: true
        })
    }

    render() {
        let contentShown
        if (this.state.logged || cookies.get('login')) {
            contentShown = <ManagementPage onLogout={this.onLogout} restaurantId="0001"/>
        } else {
            contentShown = <Login onLogin={this.onLogin}/>
        }
        return (
            <div>
                {contentShown}
            </div>
        )
    }
}