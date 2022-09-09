import React from "react";
import { Component } from "react";
import Select from "react-select"
import HeaderForm from "./BookingHeader";
import DatePicker from "react-datepicker";
import CustomTable from "./CustomTable";
import Stack from '@mui/material/Stack';

import 'react-datepicker/dist/react-datepicker.css'
import { Button } from "@material-ui/core";
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let restaurantName = '';
let activitiesList = [];
export {activitiesList};

function compareDates(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();
}

function compare( a, b ) {
  if ( a.value < b.value ){
    return -1;
  }
  if ( a.value > b.value ){
    return 1;
  }
  return 0;
}

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

class Activity{
  constructor(name, start, end, spots, days){
      this.name = name;
      this.start = start;
      this.end = end;
      this.spots = spots;
      this.days = days;
  }
}

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  100: '#eaeef2',
  300: '#afb8c1',
  900: '#24292f',
};

const CustomButton = styled(ButtonUnstyled)(
  ({ theme }) => `
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  color: ${blue[500]};
  background-color: white;
  border-color: ${blue[500]};
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: lightblue;
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 3px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
  `,
);

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusLabel: '',
      statusProp: '',
      selectedDate: new Date(),
      selectedTime: null,
      bookingGuests: null,
      bookingActivity: null,
      activityCapacity: null,
      guestName: null,
      guestSurname: null,
      guestEmail: null,
      guestPhone: null,
      guestPrivacy: null,
      guestAdditionalInfo: null,
      activities: [],
      options: [],
      errors: {
        bookingDate: '',
        bookingTime: ' ',
        bookingGuests: ' ',
        guestName: ' ',
        guestSurname: ' ',
        guestEmail: ' ',
        guestPhone: ' ',
        guestPrivacy: ' ',
        guestAdditionalInfo: ''
      },
      fieldValues: {
        bookingForewarning: '',
        bookingThreshold: '',
        bookingOffset: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  notify = () => {
    if(validateForm(this.state.errors)) {
      toast.success('Prenotazione avvenuta con succcesso!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else {
      toast.error('Prenotazione fallita!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }
  

  handleClick = (event, name) => {
    let today = new Date();
    let now = today.getHours() + ":" + today.getMinutes();
    let isToday = compareDates(this.state.selectedDate, today);
    var allButtons = document.querySelectorAll(".ButtonUnstyled-root");
    allButtons.forEach((button) => { button.classList.remove("active"); })
    var button = event.target;
    button.classList.add("active");
    const options = this.state.options;
    const nowHours = parseInt(now.substring(0,2));
    const forewarning = parseInt(this.state.fieldValues.bookingForewarning.substring(0,1));
    const minHours = nowHours + forewarning;
    const minBookingTime = String(minHours) + ":" + String(today.getMinutes());
    options.forEach((option) => {
      if(option.name != name || (isToday && option.value <= minBookingTime)) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
    this.state.options = options;
    this.state.bookingActivity = name;
    this.state.activities.forEach((activity) => {
      if(activity.name == name){
        this.state.activityCapacity = activity.spots;
      }
    })
    var selection = document.querySelector("#bookingGuestSelection");
    selection.disabled = false;
  };

  componentDidMount() {
    fetch("/activities/0001", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data) {
              let fetchedActivitiesDictionary = []

              data.activities.forEach((activity, index) => {
                  fetchedActivitiesDictionary.push(new Activity(activity.activityName,
                    activity.startingTime, activity.endingTime, activity.availableSpots,
                    activity.days));
              })

                let fetchedBookingForewarning = data.bookingForewarning;
                let fetchedBookingThreshold = data.bookingThreshold;
                let fetchedBookingOffset = data.bookingOffset;

                this.setState({
                  activities: fetchedActivitiesDictionary,
                  fieldValues: {
                    bookingForewarning: fetchedBookingForewarning,
                    bookingThreshold: fetchedBookingThreshold,
                    bookingOffset: fetchedBookingOffset
                  },
                });
                let offset = parseInt(String(this.state.fieldValues.bookingOffset).substring(0,2));

                let options = [];
                this.state.activities.forEach((activity) => {
                  let actualTime = activity.start;
                  let endTime = activity.end;
                  let hours = parseInt(String(actualTime).substring(0,2));
                  let minutes = parseInt(String(actualTime).substring(4,6));
                  let endHours = parseInt(String(endTime).substring(0,2));
                  let endMinutes = parseInt(String(endTime).substring(4,6));
                  if(actualTime > endTime){
                    endHours += 24;
                  }
                  while(hours < endHours || (hours == endHours && minutes <= endMinutes)){
                    let realMinutes;
                    let realHours;
                    if(hours == 0)
                      realHours = "00";
                    else
                      realHours = hours;
                    if(String(realHours).length == 1)
                      realHours = "0" + String(realHours);
                    if(minutes == 0)
                      realMinutes = "00";
                    else
                      realMinutes = minutes;
                      if(String(realMinutes).length == 1)
                      realMinutes = "0" + String(realMinutes);
                    options.push({
                      "label": realHours+":"+realMinutes,
                      "value": realHours+":"+realMinutes,
                      "name": activity.name,
                      "disabled": true,
                    });
                    minutes += offset;
                    if(minutes >= 60){
                      hours++;
                      minutes -= 60;
                    }
                  }
                  options.sort(compare);
                  this.state.options = options;
                });
            }
        });
    fetch("/restaurant_info/0001", {
      method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
        .then(data => {
            if (data) {
                let fetchedRestaurantName = data.restaurantName;
                restaurantName = fetchedRestaurantName;
                var link = document.querySelector(".site-title");
                link.text = restaurantName;
            }
        });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;
    let bookingThreshold = this.state.fieldValues.bookingThreshold;
    let bookingCapacity = this.state.activityCapacity;

    switch (name) {
      case 'bookingGuests':
        errors.bookingGuests =
        value.length > 0
        ? (Number.isInteger(Number(value)) && Number(value) >= 1
          ? ''
          : 'Devi inserire un numero intero maggiore di 1')
        : 'Questo campo è obbligatorio';

        if(Number.isInteger(Number(value)) && Number(value) <= parseInt(bookingThreshold) && Number(value) != 0){
          this.state.statusLabel = `\u2705 Prenotabile automaticamente.`;
          this.state.statusProp = 'yes';
        } else if(Number(value) > parseInt(bookingThreshold) && Number(value) <= parseInt(bookingCapacity)) {
          this.state.statusLabel = `⚠️ Prenotabile accordandosi col ristorante.`;
          this.state.statusProp = 'maybe';
        } else if(Number(value) > parseInt(bookingCapacity)){
          this.state.statusLabel = `\u26D4 Non prenotabile; la richiesta supera il numero di coperti disponibili.`;
          this.state.statusProp = 'no';
        } else{
          this.state.statusLabel = '';
          this.state.statusProp = '';
        }
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

  handleTimeChange = (time) => {
    this.state.errors.bookingTime = time != null ? '' : 'Questo campo è obbligatorio';
    this.setState({ selectedTime: time });
  }

  handleDateChange = (date) => {
    this.state.errors.bookingDate = date != null ? '' : 'Questo campo è obbligatorio';
    this.setState({ selectedDate: date });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.dir(this.state);
    if(validateForm(this.state.errors)) {
      console.info('Valid Form');
    }else{
      console.error('Invalid Form');
      var inputs = document.querySelectorAll(".booking,.person");
      inputs.forEach((input) => {
        if(input.value == "") {
          input.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else {
          input.setAttribute("style", "border: none;");
        }
      });
      var checkbox = document.querySelector("#guestPrivacy");
      var divPrivacy = document.querySelector(".guestPrivacy");
      if(!checkbox.checked){
        divPrivacy.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
      }
      else {
        divPrivacy.setAttribute("style", "border: none;");
      }
      var timeSelector = document.querySelector(".css-b62m3t-container");
      if(this.state.selectedTime == null) {
        timeSelector.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;")
      } else {
        timeSelector.setAttribute("style", "border: none;");
      }
    }
  } 

  render(){
    const errors = this.state.errors;
    const options = this.state.options;
    const activities = this.state.activities;
    activitiesList = activities;
    return (
      <div className="wrapper">
        <div className="form-wrapper">
            <form onSubmit={this.handleSubmit} noValidate>
            <HeaderForm />
            <div className="bookingControls">
            <div className="bookingDate">
                <label className="booking">Data di prenotazione* {errors.bookingDate.length > 0 && <span className='error'>{errors.bookingDate}</span>}
                    <DatePicker className="booking" selected={this.state.selectedDate} 
                    onChange={this.handleDateChange} 
                    dateFormat="dd-MM-yyyy" 
                    minDate={new Date()} noValidate/></label>
              </div>
              <div className="bookingActivity">
                <label className="booking">Attività*</label>
                <Stack spacing={2} direction="row">
                  {activities.map((activity) => {
                    return (<CustomButton key={activity.name} onClick={event => this.handleClick(event, activity.name)}>{activity.name}</CustomButton>)
                  })}
                </Stack>
              </div>
              <div className="bookingTime">
              <label className="booking">Ora di prenotazione* {errors.bookingTime.length > 0 && <span className='error'>{errors.bookingTime}</span>}
                <Select id="timeSelectors" className="booking" options={options} theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: 'hotpink',
                    primary: 'black',
                  },})}
                  onChange={this.handleTimeChange}
                  isOptionDisabled={(option) => option.disabled}
                  isClearable={true}
                  noValidate/></label>                                      
              </div>
              <div className="bookingGuests">
                <label className="booking">Numero di coperti* {errors.bookingGuests.length > 0 && <span className='error'>{errors.bookingGuests}</span>}<input type="number" className="booking" id="bookingGuestSelection" disabled={true} name="bookingGuests" placeholder="Inserisci i coperti" onChange={this.handleChange} noValidate min={1}/></label>
              </div>
              <div className="resturantTable">
                <label className={`bookingStatus-${this.state.statusProp}`}>{this.state.statusLabel}</label>
                <label className="resturantTableLabel">Servizi offerti dal ristorante:</label>
                <CustomTable />
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
                    <input className="person" type="checkbox" id="guestPrivacy" name="guestPrivacy" onChange={this.handleChange} noValidate/>
                    <label className="person" id="privacyLabel" htmlFor="guestPrivacy">Acconsento al trattamento dei dati personali*</label>
                </div>
            </div>
            <div className="submit">
              <button className="button" onClick={this.notify}>Invia</button>
            </div>
          </form>
        </div>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            {/* Same as */}
        <ToastContainer />
      </div>
    );
  }
}