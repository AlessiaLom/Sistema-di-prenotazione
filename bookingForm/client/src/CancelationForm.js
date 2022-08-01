import React from "react";
import { Component } from "react";
import Select from "react-select"
import HeaderForm from "./BookingHeader";
import DatePicker from "react-datepicker";
import CustomTable from "./CustomTable";

import 'react-datepicker/dist/react-datepicker.css'
import CancelationHeader from "./CancelationHeader";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default class CancelationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prenotationID: null,
      prenotationName: null,
      prenotationSurname: null,
      prenotationEmail: null,
      prenotationPhone: null,
      errors: {
        prenotationID: ' ',
        prenotationName: ' ',
        prenotationSurname: ' ',
        prenotationEmail: ' ',
        prenotationPhone: ' ',
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'prenotationID':
        errors.prenotationID =
        value.length < 1
        ? 'Questo campo è obbligatorio'
        : '';
      break;
      case 'prenotationName': 
        errors.prenotationName = 
          value.length < 1
            ? 'Questo campo è obbligatorio'
            : '';
      break;
      case 'prenotationSurname': 
        errors.prenotationSurname = 
          value.length < 1
            ? 'Questo campo è obbligatorio'
            : '';
      break;
      case 'prenotationEmail': 
        errors.prenotationEmail = 
        value.length > 0
        ? (validEmailRegex.test(value)
            ? ''
            : "La mail deve rispettare il formato corretto (email@example.com)")
        : 'Questo campo è obbligatorio';
        break;
      case 'prenotationPhone': 
        errors.prenotationPhone = 
        value.length > 0
        ? (Number.isInteger(Number(value)) && value.length > 8)
            ? ''
            : "Devi inserire un campo numerico di almeno 8 cifre (Non specificare +39)"
        : 'Questo campo è obbligatorio';
      break;
      default:
      break;
    }
    this.setState({errors, [name]: value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.dir(this.state);
    if(validateForm(this.state.errors)) {
      console.info('Valid Form')
    }else{
      console.error('Invalid Form')
    }
  } 

  render(){
    const errors = this.state.errors;
    return (
      <div className="wrapper">
        <div className="form-wrapper">
            <form onSubmit={this.handleSubmit} noValidate>
            <CancelationHeader />
            <div className="prenotationID">
            <label className="person">Codice di prenotazione* {errors.prenotationID.length > 0 && 
                    <span className='error person'>{errors.prenotationID}</span>}<input type="text" className="person" placeholder="Inserisci il codice" name="prenotationID" onChange={this.handleChange} noValidate /></label>
            </div>
            <div className="prenotationName">
            <label className="person">Nome* {errors.prenotationName.length > 0 && 
                    <span className='error person'>{errors.prenotationName}</span>}<input type="text" className="person" placeholder="Inserisci il nome" name="prenotationName" onChange={this.handleChange} noValidate /></label>
            </div>
            <div className="prenotationSurname">
            <label className="person">Cognome* {errors.prenotationSurname.length > 0 && 
                    <span className='error person'>{errors.prenotationSurname}</span>}<input type="text" className="person" placeholder="Inserisci il cognome" name="prenotationSurname" onChange={this.handleChange} noValidate /></label>
            </div>
            <div className="prenotationEmail">
            <label className="person">Email* {errors.prenotationEmail.length > 0 && 
                    <span className='error person'>{errors.prenotationEmail}</span>}<input type="text" className="person" placeholder="Inserisci la mail" name="prenotationEmail" onChange={this.handleChange} noValidate /></label>
            </div>
            <div className="prenotationPhone">
            <label className="person">Numero di telefono* {errors.prenotationPhone.length > 0 && 
                    <span className='error person'>{errors.prenotationPhone}</span>}<input type="text" className="person" placeholder="Inserisci il numero di telefono" name="prenotationPhone" onChange={this.handleChange} noValidate /></label>
            </div>
            <div className="submit">
              <button className="button">Invia</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
