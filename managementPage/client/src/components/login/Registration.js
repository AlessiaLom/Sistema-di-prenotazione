import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/login.css"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

/**
 * Login form to the management page
 */
export default class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            validationErrors: {
                emailError: null,
                passwordError: null,
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    onEmailChange = (event) => {
        if(event.target.value === ''){
            this.setState({ email: null });
            this.setState({ validationErrors: {
                emailError: 'Questo campo è obbligatorio',
                passwordError: null,
                noMatchError: null
            }});
        } else if (!validEmailRegex.test(event.target.value)){
            this.setState({ email: null });
            this.setState({ validationErrors: {
                emailError: 'La mail non è nel formato corretto (mail@example.com)',
                passwordError: null,
                noMatchError: null
            }});
        } else {
            this.setState({ email: event.target.value });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }});
        }
    }

    onPswChange = (event) => {
        if(event.target.value === ''){
            this.setState({ password: null });
            this.setState({ validationErrors: {
                emailError: 'Questo campo è obbligatorio',
                passwordError: null,
                noMatchError: null
            }});
        } else if (event.target.value.length < 8){
            this.setState({ email: null });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: 'La password dev\'essere lunga almeno 8 caratteri',
                noMatchError: null
            }});
        } else {
            this.setState({ password: event.target.value });
            this.setState({ validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }});
        }
    }

    handleSubmit() {
        if(!this.state.validationErrors.emailError && !this.state.validationErrors.passwordError){
            fetch("/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (Object.keys(data).includes('restaurantId')) {
                        cookies.set('login', true, { path: '/' });
                        this.props.onLogin(data.restaurantId);
                    }
                })
        }
    }

    render() {
        let errors = this.state.validationErrors;
        return (
            <>
            <div className='wrapper'>
                <div className='formContainer'>
                    <form>
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
                            <input onClick={this.handleSubmit} type="button" className="btn btn-primary btn-block mb-4" value="Registrati" disabled={this.state.email === null && this.state.password === null}/>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}