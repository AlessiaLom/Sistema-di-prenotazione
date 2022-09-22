import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/login.css"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

/**
 * Login form to the management page
 */
export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            validationErrors: {
                emailError: null,
                passwordError: null,
                noMatchError: null
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
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

    handleSubmit() {
        if(!this.state.validationErrors.emailError && !this.state.validationErrors.passwordError){
            fetch("/authentication", {
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
                        this.props.onLogin(data.restaurantId)
                    }
                })
        }
        // event.preventDefault();
        // if(!this.areMatching(this.state.email, this.state.password)){
        //     this.setState({ validationErrors: {
        //         emailError: null,
        //         passwordError: null,
        //         noMatchError: 'Email e/o password errati.'
        //     }});
        // } else {
        //     this.setState({ validationErrors: {
        //         emailError: null,
        //         passwordError: null,
        //         noMatchError: null
        //     }});
        //
        //     //window.location.reload();
        // }
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
                            <input onClick={this.handleSubmit} type="button" className="btn btn-primary btn-block mb-4" value="Accedi" disabled={this.state.email === null || this.state.password === null}/>
                            {errors.noMatchError != null && <span className='matchError'>{errors.noMatchError}</span>}
                        </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}