import React, { useState } from "react";
import { Component } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select"
import HeaderForm from "./HeaderForm";
import DatePicker from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css'

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      selectedTime: [],
      bookingGuests: null,
      guestName: null,
      guestSurname: null,
      guestEmail: null,
      guestPhone: null,
      guestPrivacy: null,
      guestAdditionalInfo: null,
      errors: {
        bookingGuests: '',
        guestName: '',
        guestSurname: '',
        guestEmail: '',
        guestPhone: '',
        guestPrivacy: '',
        guestAdditionalInfo: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'bookingGuests':
        errors.bookingGuests =
        value.length > 0
        ? (Number.isInteger(Number(value)) && Number(value) >= 1
          ? ''
          : 'Devi inserire un numero maggiore di 1')
        : 'Questo campo è obbligatorio';
      break;
      case 'guestName': 
        errors.guestName = 
          value.length < 1
            ? 'Questo campo è obbligatorio'
            : '';
      break;
      case 'guestSurname': 
        errors.guestSurname = 
          value.length < 1
            ? 'Questo campo è obbligatorio'
            : '';
      break;
      case 'guestEmail': 
        errors.guestEmail = 
        value.length > 0
        ? (validEmailRegex.test(value)
            ? ''
            : "La mail deve rispettare il formato corretto (email@example.com)")
        : 'Questo campo è obbligatorio';
        break;
      case 'guestPhone': 
        errors.guestPhone = 
        value.length > 0
        ? (Number.isInteger(Number(value)) && value.length > 8)
            ? ''
            : "Devi inserire un campo numerico di almeno 8 cifre (Non specificare +39)"
        : 'Questo campo è obbligatorio';
      break;
      case 'guestPrivacy':
        console.log(event.target.checked);
        errors.guestPrivacy =
        event.target.checked
          ? ''
          : 'Devi accettare il consenso per la privacy';
      break;
      case 'guestAdditionalInfo':
        errors.guestAdditionalInfo =
        value.length < 1000
        ? ''
        : 'Quest\'area di testo non può superare i 1000 caratteri';
      break;
      default:
      break;
    }
    this.setState({errors, [name]: value});
  }

  handleTimeChange = (value) => {
    this.setState({ selectedTime: value });
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    if(validateForm(this.state.errors)) {
      console.info('Valid Form')
    }else{
      console.error('Invalid Form')
    }
  } 

  render(){
    //const [date, handleDateSelect, handleDateChange] = useState(new Date());
    const options = [
      { value: '12:00', label: '12:00', disabled: true },
      { value: '12:15', label: '12:15', disabled: true },
      { value: '12:30', label: '12:30', disabled: false },
      { value: '12:45', label: '12:45', disabled: true },
      { value: '13:00', label: '13:00', disabled: true },
      { value: '13:15', label: '13:15', disabled: false },
      { value: '13:30', label: '13:30', disabled: true },
      { value: '13:45', label: '13:45', disabled: true },
      { value: '14:00', label: '14:00', disabled: true },
      { value: '19:00', label: '19:00', disabled: false },
      { value: '19:15', label: '19:15', disabled: true },
      { value: '19:30', label: '19:30', disabled: true },
      { value: '19:45', label: '19:45', disabled: true },
      { value: '20:00', label: '20:00', disabled: false },
      { value: '20:15', label: '20:15', disabled: true },
      { value: '20:30', label: '20:30', disabled: true},
      { value: '20:45', label: '20:45', disabled: false },
      { value: '21:00', label: '21:00', disabled: true },
    ];
    const {errors} = this.state;
    return (
      <div className="wrapper">
        <div className="form-wrapper">
            <form onSubmit={this.handleSubmit} noValidate>
            <HeaderForm />
            <div className="bookingControls">
            <div className="bookingDate">
                <label className="booking">Data di prenotazione* 
                    <DatePicker className="booking" selected={this.state.selectedDate} 
                    onChange={this.handleDateChange} 
                    dateFormat="dd-MM-yyyy" 
                    minDate={new Date()} noValidate/></label>
              </div>
              <div className="bookingTime">
              <label className="booking">Ora di prenotazione*
                <Select className="booking" defaultValue={options.filter(option => option.disabled === false)[0]} options={options} theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                                                                        ...theme.colors,
                                                                        primary25: 'hotpink',
                                                                        primary: 'black',
                  },})}
                  onChange={this.handleTimeChange}
                  isOptionDisabled={(option) => option.disabled} 
                  noValidate/></label>                                      
              </div>
              <div className="bookingGuests">
                <label className="booking">Numero di coperti* {errors.bookingGuests.length > 0 && <span className='error'>{errors.bookingGuests}</span>}<input type="number" className="booking" name="bookingGuests" placeholder="Inserisci i coperti" onChange={this.handleChange} noValidate min={1}/></label>
              </div>
            </div>
            <div className="personControls">
              <div className="guestName">
                <label className="person">Nome*  {errors.guestName.length > 0 && 
                    <span className='error person'>{errors.guestName}</span>}<input type="text" className="person" placeholder="Inserisci il nome" name="guestName" onChange={this.handleChange} noValidate /></label>
                </div>
                <div className="guestSurname">
                <label className="person">Cognome* {errors.guestSurname.length > 0 && 
                    <span className='error person'>{errors.guestSurname}</span>}<input type="text" className="person" name="guestSurname" placeholder="Inserisci il cognome"  onChange={this.handleChange} noValidate /></label>
                </div>
                <div className="guestEmail">
                <label className="person">Email* {errors.guestEmail.length > 0 && 
                    <span className='error person'>{errors.guestEmail}</span>}<input type="text" className="person" name="guestEmail" placeholder="Inserisci la mail" onChange={this.handleChange} noValidate/></label>
                </div>
                <div className="guestPhone">
                <label className="person">Numero di cellulare* {errors.guestPhone.length > 0 && 
                    <span className='error person'>{errors.guestPhone}</span>}<input type="tel" className="person" name="guestPhone" placeholder="Inserisci il cellulare" onChange={this.handleChange} noValidate /></label>
                </div>
                <div className="guestAdditionalInfo">
                <label className="person">Informazioni aggiuntive {errors.guestAdditionalInfo.length > 0 && 
                    <span className='error person'>{errors.guestAdditionalInfo}</span>}<textarea name="guestAdditionalInfo" placeholder="Scrivi qui..." onChange={this.handleChange} noValidate /></label>
                </div>
                <div className="guestPrivacy">
                {errors.guestPrivacy.length > 0 && 
                    <span className='privacyError person'>{errors.guestPrivacy}</span>}
                </div>
                <input className="person" type="checkbox" id="guestPrivacy" name="guestPrivacy" onChange={this.handleChange} noValidate/>
                <label className="person" id="privacyLabel" htmlFor="guestPrivacy">Acconsento al trattamento dei dati personali*</label>
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
