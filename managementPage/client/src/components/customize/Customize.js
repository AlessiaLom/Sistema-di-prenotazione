import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import TextForm from '../utility/TextForm';
import ColorPicker from '../utility/ColorPicker';
import { BsFacebook, BsInstagram, BsMessenger, BsWhatsapp } from 'react-icons/bs';


export default class Customize extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - no props
         */
        super(props)
        this.state = {
            required: ["restaurantName"], // Stores the names of the fields that are required
            fieldsValues: { // Stores customize page values
                restaurantName: '',
                additionalInfo: '',
                logoPath: '',
                socialNetworks: { // Links to social networks
                    facebook: '',
                    instagram: '',
                    messenger: '',
                    whatsapp: ''
                },
                primaryColor: { // Primary color in rgba format
                    r: 65,
                    g: 22,
                    b: 80,
                    a: 1
                },
                secondaryColor: {// Secondary color in rgba format
                    r: 14,
                    g: 16,
                    b: 28,
                    a: 1
                },

            },
            validationErrors: {
                restaurantNameError: '',
                additionalInfoError: '',
                colorThemeError: '',
                logoPathError: ''
            }
        }

        //Function binding
        this.handleChange = this.handleChange.bind(this)
        this.checkErrors = this.checkErrors.bind(this)
        this.checkEmptyFields = this.checkEmptyFields.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    /**
     * Performs fetch to retrieve info about form customization based on the restaurant id passe as request param
     */
    componentDidMount() {
        // console.log(JSON.stringify(this.state))
        fetch("/customize/0001", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    fieldsValues: {
                        restaurantName: data.restaurantName,
                        additionalInfo: data.additionalInfo,
                        logoPath: data.logoPath,
                        primaryColor: data.primaryColor,
                        secondaryColor: data.secondaryColor,
                        socialNetworks: data.socialNetworks
                    }
                })
            })
    }

    /**
     * Handles button click (save changes or cancel changes)
     * "Salva impostazioni" -> Saves new info in db
     * "Annulla" -> revert back to previous state
     * @param {*} event button click
     */
    onClick(event) {
        const { name, value } = event.target
        switch (name) {
            case "saveChanges":
                fetch('/customize/save_changes/0001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        additionalInfo: this.state.fieldsValues.additionalInfo,
                        primaryColor: this.state.fieldsValues.primaryColor,
                        secondaryColor: this.state.fieldsValues.secondaryColor,
                        logoPath: this.state.fieldsValues.logoPath,
                        socialNetworks: this.state.fieldsValues.socialNetworks,
                        restaurantName: this.state.fieldsValues.restaurantName
                    })
                });
                break;
            case "cancelChanges":
                // MISSING 
                // When the button is pressed it is sufficient to refresh the page/fetch info from db again
                break;
            default:
                break;
        }
    }

    /**
     * Checks among the required fields if there are empty ones.
     * The required fields are saved in this.state.required as strings representing their names (es. ['bookingForewarning'])
     * @returns true if the page contains empty fields, false otherwise
     */
    checkEmptyFields() {
        let fieldsValues = this.state.fieldsValues
        for (const field in fieldsValues) {
            if (this.state.required.includes(field) && fieldsValues[field].trim() == '') {
                return true
            }
        }
        return false
    }

    /**
     * Checks for validation errors
     * @returns true if there are validation errors
     */
    checkErrors() {
        let validationErrors = this.state.validationErrors
        for (const error in validationErrors) {
            if (validationErrors[error] != '')
                return true
        }
        return false
    }

    /**
     * Handles changes in the fields by checking for validation errors and storing new values
     * @param {*} event event triggered by some change in the fields
     */
    handleChange(event) {
        const { name, value } = event.target
        let newValidationErrors = this.state.validationErrors
        let newFieldsValues = this.state.fieldsValues

        // Check which input got changed and performs proper validation checks
        switch (name) {
            case "restaurantName": // There is no validation error on the minumum notice selection
                // console.log("changed " + name + " has value " + value)
                if (value && value.trim() != '') { // If activity name has no value, the row contains errors regarding activity name
                    newValidationErrors.restaurantNameError = ''
                } else {
                    newValidationErrors.restaurantNameError = 'Campo obbligatorio'
                }
                // Update field value in state dictionary
                newFieldsValues.restaurantName = value
                break;
            case "primaryColorPicker":
                // console.log("changed " + name + " has value " + value)
                newFieldsValues.primaryColor = value
                break;
            case "secondaryColorPicker":
                // console.log("changed " + name + " has value " + value)
                newFieldsValues.secondaryColor = value
                break;
            case "facebookLink":
                // console.log("changed " + name + " has value " + value)
                newFieldsValues.socialNetworks['facebook'] = value
                break;
            case "instagramLink":
                // console.log("changed " + name + " has value " + value)
                newFieldsValues.socialNetworks["instagram"] = value
                break;
            case "messengerLink":
                // console.log("changed " + name + " has value " + value)
                newFieldsValues.socialNetworks["messenger"] = value
                break;
            case "whatsappLink":
                //  console.log("changed " + name + " has value " + value)
                newFieldsValues.socialNetworks["whatsapp"] = value
                break;
            default:
                break;
        }

        // Update the state
        this.setState({
            fieldsValues: newFieldsValues,
            validationErrors: newValidationErrors
        })
    }

    render() {
        let hasErrors = this.checkErrors()
        // Check if are there empty fields 
        let hasEmptyFields = this.checkEmptyFields()
        return (
            <div style={{ width: "100%", margin: "1%", padding: "1%" }}>
                <div className="d-block mb-3">
                    <h4>Info del ristorante</h4>
                    <hr></hr>
                    <h6> Nome </h6>
                    Il nome del ristorante verrà visualizzato sotto al logo
                    <TextForm
                        value={this.state.fieldsValues.restaurantName}
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.restaurantNameError}
                        name="restaurantName"
                        placeholder="Inserisci il nome del ristorante" />
                </div>
                <div className="d-block mb-3">
                    <h6> Info aggiuntive</h6>
                    In questa sezione potrai personalizzare il messaggio visualizzato sotto il nome del ristorante ed il logo, per esempio con una frase di benvenuto.
                    <TextForm
                        value={this.state.fieldsValues.additionalInfo}
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.additionalInfoError}
                        name="additionalInfo"
                        placeholder="Inserisci informazioni aggiuntive" />
                </div>
                <br></br>
                <div className="d-block mb-3">
                    <h4>Tema colore</h4>
                    <hr></hr>
                    Colore principale:
                    <ColorPicker
                        color={this.state.fieldsValues.primaryColor}
                        name="primaryColorPicker"
                        onChange={this.handleChange}
                    />
                    Colore secondario:
                    <ColorPicker
                        color={this.state.fieldsValues.secondaryColor}
                        name="secondaryColorPicker"
                        onChange={this.handleChange}
                    />
                </div>
                <br></br>
                <div className="d-block input-group mb-3">
                    <h4>Logo del ristorante</h4>
                    <hr></hr>
                    <div className="input-group mb-3">
                        <input type="file" className="form-control" id="inputGroupFile02"></input>
                    </div>
                </div>
                <br></br>
                <h4>Social Networks</h4>
                <hr></hr>
                <p>I link ai social verranno associati ai rispettivi pulsanti
                    presenti nel form di prenotazione visualizzato dai clienti.
                    Lasciando vuoto il link di un social si farà in modo che il
                    suo pulsante non compaia nel form di prenotazione</p>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <BsFacebook size={30} />
                            </td>
                            <td>
                                <TextForm
                                    value={this.state.fieldsValues.socialNetworks.facebook}
                                    name="facebookLink"
                                    placeholder="Inserisci il link"
                                    onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <BsInstagram size={30} />
                            </td>
                            <td>
                                <TextForm
                                    value={this.state.fieldsValues.socialNetworks.instagram}
                                    name="instagramLink"
                                    placeholder="Inserisci il link"
                                    onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <BsMessenger size={30} />

                            </td>
                            <td>
                                <TextForm
                                    value={this.state.fieldsValues.socialNetworks.messenger}
                                    name="messengerLink"
                                    placeholder="Inserisci il link"
                                    onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <BsWhatsapp size={30} />

                            </td>
                            <td>
                                <TextForm
                                    value={this.state.fieldsValues.socialNetworks.whatsapp}
                                    name="whatsappLink"
                                    placeholder="Inserisci il link"
                                    onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>

                </table>
                <div style={{ margin: "15 %", padding: "1 %", margin: "0", border: "0" }}>
                    <button name="cancelChanges" type="button" className="btn btn-light">Annulla</button>
                    <button
                        name="saveChanges"
                        type="button"
                        className={"btn btn-primary" + (hasErrors || hasEmptyFields ? " disabled" : "")}
                        onClick={this.onClick}>
                        {/*Disable the button if there are validation errors*/}
                        Salva impostazioni
                    </button>
                </div>

            </div>
        )
    }
}