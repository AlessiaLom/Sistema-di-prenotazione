import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import App from '../App';
import "./../../styles/login.css"
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let credentials = [];

/**
 * Login form to the management page
 */
export default class Login extends React.Component {
    constructor(props) {
        /**
         *  props: no props
         */
        super(props)
        this.state = {
            restaurantId: '0001',
            email: null,
            password: null,
            validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        fetch("/authentication/" + this.state.restaurantId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                credentials = data.credentials;
                console.dir(credentials)
            }
        })
    }

    /**
     * Checks whether the fields are matching with valid ones
     * @returns true if there the fields match
     */
    areMatching = (usr, psw) => {
       return credentials.email === usr && credentials.password === psw;
    }

    onEmailChange = (event) => {
        if(event.target.value != ''){
            this.setState({ email: event.target.value });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }});
        } else {
            this.setState({ email: null });
            this.setState({ validationErrors: {
                emailError: 'Questo campo è obblgatorio',
                passwordError: null,
                noMatchError: null
            }});
        }
    }

    onPswChange = (event) => {
        if(event.target.value != ''){
            this.setState({ password: event.target.value });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }});
        } else {
            this.setState({ password: null });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: 'Questo campo è obblgatorio',
                noMatchError: null
            }});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!this.areMatching(this.state.email, this.state.password)){
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: 'Email e/o password errati.'
            }});
        } else {
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }});
            cookies.set('login', true, { path: '/' });
            window.location.reload();
        }
    }

    render() {
        let errors = this.state.validationErrors;
        return (
            <>
            <div className='wrapper'>
                <div className='formContainer'>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-outline mb-4 usrField">
                        {errors.emailError != null && <span className='usrError'>{errors.emailError}</span>}
                            <label className="form-label" htmlFor="usrInput">Email*</label>
                            <input type="email" id="usrInput" className="form-control" onChange={this.onEmailChange} />
                        </div>
                        <div>
                            <div className="form-outline mb-4 pswField">
                            {errors.passwordError != null && <span className='pswError'>{errors.passwordError}</span>}
                                <label className="form-label" htmlFor="pswInput">Password*</label>
                                <input type="password" id="pswInput" className="form-control" onChange={this.onPswChange} />
                            </div>
                        </div>
                        <div className='submit'>
                            <input type="submit" className="btn btn-primary btn-block mb-4" value="Accedi" disabled={this.state.email === null || this.state.password === null}/>
                            {errors.noMatchError != null && <span className='matchError'>{errors.noMatchError}</span>}
                        </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}