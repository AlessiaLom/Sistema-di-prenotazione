import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/pages.css"
import TextForm from './TextForm';
import ColorPicker from './ColorPicker';

export default class Customize extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fieldsValues: {
                restaurantName: '',
                additionalInfo: 'filling value for testing',
                restaurantLogo: 'filling value for testing',
                mainColor: '(191,22,80,1)',
                secondaryColor: '(14,16,28,1)'
            },
            validationErrors: {
                restaurantNameError: '',
                additionalInfoError: '',
                colorThemeError: '',
                restaurantLogoError: ''
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.checkErrors = this.checkErrors.bind(this)
        this.checkEmptyFields = this.checkEmptyFields.bind(this)

    }

    checkEmptyFields() {
        let fieldsValues = this.state.fieldsValues
        for (const field in fieldsValues) {
            if (fieldsValues[field].trim() == '') {
                return true
            }
        }
        return false
    }

    checkErrors() {
        let validationErrors = this.state.validationErrors
        for (const error in validationErrors) {
            if (validationErrors[error] != '')
                return true
        }
        return false
    }


    handleChange(event) {
        const { name, value } = event.target
        let newValidationErrors = this.state.validationErrors
        let newFieldsValues = this.state.fieldsValues

        // Check which input got changed and performs proper validation checks
        switch (name) {
            case "restaurantName": // There is no validation error on the minumum notice selection
                console.log("changed " + name + " has value " + value)
                if (value && value.trim() != '') { // If activity name has no value, the row contains errors regarding activity name
                    newValidationErrors.restaurantNameError = ''
                } else {
                    newValidationErrors.restaurantNameError = 'Campo obbligatorio'
                }
                // Update field value in state dictionary
                newFieldsValues.restaurantName = value
                break;
            case "mainColorPicker":
                console.log("changed " + name + " has value " + value)
                let parsedValueMain = "(" + value.r + "," + value.g + "," + value.b + "," + value.a + ")"
                newFieldsValues.mainColor = parsedValueMain
                break;
            case "secondaryColorPicker":
                console.log("changed " + name + " has value " + value)
                let parsedValueSecondary = "(" + value.r + "," + value.g + "," + value.b + "," + value.a + ")"
                newFieldsValues.secondaryColor = parsedValueSecondary
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
                <div className="d-block input-group mb-3">
                    <h4>Info del ristorante</h4>
                    <h6> Nome </h6>
                    Il nome del ristorante verrà visualizzato sotto al logo
                    <TextForm
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.restaurantNameError}
                        name="restaurantName"
                        placeholder="Inserisci il nome del ristorante" />
                </div>
                <div className="d-block input-group mb-3">
                    <h6> Info aggiuntive</h6>
                    In questa sezione potrai personalizzare il messaggio visualizzato sotto il nome del ristorante ed il logo, per esempio con una frase di benvenuto.
                    <TextForm
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.additionalInfoError}
                        name="additionalInfo"
                        placeholder="Inserisci informazioni aggiuntive" />
                </div>
                <hr></hr>
                <div className="d-block input-group mb-3">
                    <h4>Tema colore</h4>
                    Colore principale:
                    <ColorPicker
                        color={{
                            r: 191,
                            g: 22,
                            b: 80,
                            a: 1
                        }}
                        name="mainColorPicker"
                        onChange={this.handleChange}
                    />
                    Colore secondario:
                    <ColorPicker
                        color={{
                            r: 14,
                            g: 16,
                            b: 28,
                            a: 1
                        }}
                        name="secondaryColorPicker" 
                        onChange={this.handleChange}
                    />
                </div>
                <hr></hr>
                <div className="d-block input-group mb-3">
                    <h4>Logo del ristorante</h4>
                    <div className="input-group mb-3">
                        <input type="file" className="form-control" id="inputGroupFile02"></input>
                    </div>
                </div>
                <hr></hr>
                <div style={{ margin: "15 %", padding: "1 %", margin: "0", border: "0" }}>
                    <button type="button" className="btn btn-light">Annulla</button>
                    <button
                        id="saveChangesButton"
                        type="button"
                        className={"btn btn-primary" + (hasErrors || hasEmptyFields ? " disabled" : "")}>
                        {/*Disable the button if there are validation errors*/}
                        Salva impostazioni
                    </button>
                </div>
            </div>
        )
    }
}