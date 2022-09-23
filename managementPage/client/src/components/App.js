import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/management.css"
import "./../styles/sideBar.css"
import Login from './login/Login';
import Cookies from 'universal-cookie';
import ManagementPage from "./managementPage/ManagementPage";
import Registration from './login/Registration';

const cookies = new Cookies();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantId: '',
            logged: false,
            showRegisterForm: false
        }
        this.onLogin = this.onLogin.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.onRegister = this.onRegister.bind(this)
    }

    onLogout() {
        cookies.remove('login')
        cookies.remove('restaurantId')
        this.setState({
            logged: false
        })
    }

    onLogin(restaurantId) {
        this.setState({
            restaurantId: restaurantId,
            logged: true,
            showRegisterForm: false
        })
    }

    onRegister(){
        this.setState({
            showRegisterForm: true
        })
    }

    render() {
        let contentShown
        if (this.state.logged || cookies.get('login')) {
            contentShown = <ManagementPage onLogout={this.onLogout} restaurantId={this.state.restaurantId}/>
        } else if(!this.state.showRegisterForm){
            contentShown = <Login onLogin={this.onLogin} register={this.onRegister}/>
        } else {
            contentShown = <Registration onLogin={this.onLogin}/>
        }
        return (
            <div>
                {contentShown}
            </div>
        )
    }
}