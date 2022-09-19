import React from "react";
import { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-datepicker/dist/react-datepicker.css'
import CancelationHeader from "./CancelationHeader";

let bookings = [];
let bookingFocus;
let restaurantName, primaryColor, secondaryColor;

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

  notifySuccess = () => {
    toast.success('Cancellazione avvenuta con succcesso!', {
      toastId: 'success1',
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
}

notifyError = (msg) => {
  toast.error(msg, {
    toastId: 'error1',
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
}

  componentDidMount(){
    fetch("/bookings/0001", {
      method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
        .then(data => {
            if (data) {
                let fetchedBookings = [];
                data.bookings.forEach((d) => {
                    fetchedBookings.push(d);
                })
                bookings = fetchedBookings;
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
                let fetchedRestaurantInfo = data.additionalInfo;
                var paragraph = document.querySelector(".additionalInfo");
                paragraph.innerHTML = fetchedRestaurantInfo;
                let fetchedSiteLink = data.siteLink;
                var siteLink = document.querySelector(".site-title");
                siteLink.setAttribute("href", fetchedSiteLink);
                let fetchedPrimaryColor = data.primaryColor;
                primaryColor = "rgba(" + fetchedPrimaryColor.r + ", " + fetchedPrimaryColor.g + ", " + fetchedPrimaryColor.b + ", " + fetchedPrimaryColor.a + ")";
                var body = document.querySelector("body");
                body.style.setProperty('--primary-color', primaryColor);
                body.style.setProperty('--secondary-color', secondaryColor);
                let fetchedSecondaryColor = data.secondaryColor;
                secondaryColor = "rgba(" + fetchedSecondaryColor.r + ", " + fetchedSecondaryColor.g + ", " + fetchedSecondaryColor.b + ", " + fetchedSecondaryColor.a + ")";
                var buttons = document.querySelectorAll(".button");
                buttons.forEach((button) => button.style.setProperty("--secondary-color", secondaryColor));
                var fieldInfo = document.querySelector(".fieldInfo");
                fieldInfo.style.setProperty('--secondary-color', secondaryColor);
                var svg = document.querySelector("svg#logo");
                svg.style.setProperty('--secondary-color', secondaryColor);
                var fb = document.getElementById("facebook-div");
                var msg = document.getElementById("messenger-div");
                var ig = document.getElementById("instagram-div");
                var wa = document.getElementById("whatsapp-div");
                if(data.socialNetworks.facebook != null){
                  var fblink = document.querySelector("#facebook-link");
                  fblink.setAttribute("href", data.socialNetworks.facebook);
                } else {
                  fb.style.display = "none";
                }
                if(data.socialNetworks.messenger != null){
                  var msglink = document.querySelector("#messenger-link");
                  msglink.setAttribute("href", data.socialNetworks.messenger);
                } else {
                  msg.style.display = "none";
                }
                if(data.socialNetworks.instagram != null){
                  var iglink = document.querySelector("#instagram-link");
                  iglink.setAttribute("href", data.socialNetworks.instagram);
                } else {
                  ig.style.display = "none";
                }
                if(data.socialNetworks.whatsapp != null){
                  var walink = document.querySelector("#whatsapp-link");
                  walink.setAttribute("href", data.socialNetworks.whatsapp);
                } else {
                  wa.style.display = "none";
                }
                let logoPath = data.logoPath;
                var img = document.querySelector(".logo-main > img");
                var favicon = document.querySelector("#favicon");
                img.setAttribute("src", logoPath);
                favicon.setAttribute("href", logoPath);
              }
              const { search } = window.location;
              const deleteSuccess = (new URLSearchParams(search)).get('cancelation');
              if (deleteSuccess === 'success') {
                this.notifySuccess();
              }
        });
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
    if(validateForm(this.state.errors)) {
      var inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.setAttribute("style", "border: none;");
      })
      let found = false;
      bookings.forEach((booking) => {
        if(booking.id === this.state.prenotationID){
          found = true;
          bookingFocus = booking;
        }
      });
      if(!found){
        this.notifyError("Nessuna prenotazione trovata con quell'ID...");
        var inputID = document.querySelector("input:first-of-type");
        inputID.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
      } else {
        if(bookingFocus.guestName !== this.state.prenotationName){
          this.notifyError("Il nome associato alla prenotazione non corrisponde...");
          var inputName = document.querySelector(".prenotationName input");
          inputName.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else if(bookingFocus.guestSurname !== this.state.prenotationSurname){
          this.notifyError("Il cognome associato alla prenotazione non corrisponde...");
          var inputSurname = document.querySelector(".prenotationSurname input");
          inputSurname.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else if(bookingFocus.guestEmail !== this.state.prenotationEmail){
          this.notifyError("La mail associata alla prenotazione non corrisponde...");
          var inputEmail = document.querySelector(".prenotationEmail input");
          inputEmail.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else if(bookingFocus.guestPhone !== this.state.prenotationPhone){
          this.notifyError("Il numero di telefono associato alla prenotazione non corrisponde...");
          var inputPhone = document.querySelector(".prenotationPhone input");
          inputPhone.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else {
          let databody = {
            "id": "0001",
            "bookingId": this.state.prenotationID,
            }
          window.location.href = window.location.pathname + '?cancelation=success';
          return fetch('/booking/update', {
              method: 'POST',
              body: JSON.stringify(databody),
              headers: {
                  'Content-Type': 'application/json'
              },
          })
          .then(res => res.json())
          .then(data => console.log(data));
        }
      }
    } else {
      this.notifyError("Riempire tutti i campi...");
      inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        if(input.value === "") {
          input.setAttribute("style", "border-color: red; border-style: solid; border-radius: 1%; transition-duration: 0.1s;");
        } else {
          input.setAttribute("style", "border: none;");
        }
      });
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
