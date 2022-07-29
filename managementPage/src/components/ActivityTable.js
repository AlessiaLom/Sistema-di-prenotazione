import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/pages.css"
import ActivityRow from './ActivityRow';
import TimePicker from './TimePicker';
import Select from './Select';
import { Textarea } from 'react-bootstrap-icons';
import TextForm from './TextForm';
/**
 * Returns values of the passed dictionary as array
 * @param {*} dictionary 
 * @returns 
 */
function getDictionaryValues(dictionary) {
    var values = Object.keys(dictionary).map(function (key) {
        return dictionary[key];
    });
    return values
}

/**
 * Contains activity rows and manages addition and deletion of rows of the table.
 */
export default class ActivityTable extends React.Component {
    constructor(props) {
        /**
         *  props: no props
         *      
         */
        super(props)
        this.state = {
            rowsDictionary: {}, // stores rows indexed by their keys as it is a dictionary (key = row's uniqueId, value = ActivityRow)
            rowsErrorsDictionary: {}, // stores validation errors indexed by the key of the row that contains validation errors (key = row's uniqueId, value = boolean)
            lastKey: 0, // keeps track of the last key/uniqueId used and gets incremented each time a new one is used
            validationErrors: {
                autoConfirmThresholdError: ''
            },
            fieldsValues: {
                minimumNotice: '',
                autoConfirmThreshold: ''
            }
        }
        this.areThereValidationErrors = this.areThereValidationErrors.bind(this)
        this.addActivityRow = this.addActivityRow.bind(this)
        this.deleteActivityRow = this.deleteActivityRow.bind(this)
        this.manageRowChanges = this.manageRowChanges.bind(this)
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
            case "selectMinimumNotice": // There is no validation error on the minumum notice selection
                console.log("changed " + name + " has value " + value)
                // Update field value in state dictionary
                newFieldsValues.minimumNotice = value
                break;
            case "autoConfirmThreshold":
                console.log("changed " + name + " has value " + value)
                if (Number.isInteger(Number(value)) && Number(value) > 0) {
                    newValidationErrors.autoConfirmThresholdError = ''
                } else {
                    newValidationErrors.autoConfirmThresholdError = 'Inserisci un numero positivo'
                }

                // Update field value in state dictionary
                newFieldsValues.autoConfirmThreshold = value
                break
            default:
                break;
        }

        // Update the state
        this.setState({
            fieldsValues: newFieldsValues,
            validationErrors: newValidationErrors
        })
    }

    /**
    * Checks if the rowsErrorsDictionary contains at least one true value
    * @returns true if there is at least one error
    */
    areThereValidationErrors() {
        let values = getDictionaryValues(this.state.rowsErrorsDictionary)
        return values.includes(true) // if at least one dictionary element corresponds to true it means that at least one row contains errors
    }

    /**
     * Updates the rowsErrorsDictionary when a row gets modified (one of its fields changes)
     * @param {int} uniqueId uniqueId of the row that changed
     * @param {boolean} hasErrors boolean true if the just modified row contains errors
     */
    manageRowChanges(uniqueId, hasErrors) {
        let newRowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary
        newRowsErrorsDictionary[uniqueId] = hasErrors

        this.setState({
            rowsErrorsDictionary: newRowsErrorsDictionary
        })
    }

    /**
     * Adds a row to the activity table
     */
    addActivityRow() {
        // Sets the state with the new rows dictionary, the new errors dictionary and the new key to use for the next row

        let newKey = this.state.lastKey + 1 // Compute new key

        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newrowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary

        // Update the rows dictionary
        newRowsDictionary[newKey] =
            <ActivityRow
                key={newKey}
                uniqueId={newKey}
                onClick={this.deleteActivityRow}
                onChange={this.manageRowChanges} />

        // Update the errors dictionary
        newrowsErrorsDictionary[newKey] = true // The new row is set to contain errors when created because it is empty

        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            rowsErrorsDictionary: newrowsErrorsDictionary,
            lastKey: newKey
        });
    }

    /**
     * Deletes the ActivityRow with uniqueId from the ActivityTable
     * @param {int} uniqueId uniqueId of the row that has to be deleted. Is passed by the ActivityRow when the delete button is pressed
     */
    deleteActivityRow(uniqueId) {
        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newrowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary
        delete newRowsDictionary[uniqueId] // Delete entry from rows dictionary
        delete newrowsErrorsDictionary[uniqueId] // Delete entry from errors dictionary
        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            rowsErrorsDictionary: newrowsErrorsDictionary
        })
    }

    render() {
        let rows = getDictionaryValues(this.state.rowsDictionary)
        let rowsWithErrors = this.areThereValidationErrors() // true or false
        // Check if are there errors in the fields not included in the rows (eg. autoConfirmThreshold)
        let hasErrors = this.checkErrors()
        // Check if are there empty fields 
        let hasEmptyFields = this.checkEmptyFields()
        return (
            <><div>
                <div>
                    <h4>Informazioni generali</h4>
                    <hr></hr>
                    <h6>Preavviso minimo</h6>
                    <p>Il preavviso minimo è espresso in ore e minuti e sarà applicato a tutte le attività elencate nella tabella attività</p>
                    <Select
                        onChange={this.handleChange}
                        name="selectMinimumNotice"
                        options={new Array("Nessun preavviso", "1:00h", "1:30h", "2:00h", "2:30h", "3:00h", "3:30h")}
                    />
                    <h6>Soglia per conferma automatica</h6>
                    <p>La soglia per la conferma automatica rappresenta il numero
                        di coperti entro il quale la conferma della prenotazione
                        è inviata automaticamente al cliente ed oltre il quale la
                        conferma sarà manuale da parte del ristoratore</p>
                    <TextForm
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.autoConfirmThresholdError}
                        name="autoConfirmThreshold"
                        placeholder="es. 5"
                    />
                </div>
                <hr></hr>
                <div>
                    <h4>Lista attività</h4>
                    <hr></hr>
                </div>
                <table id="activitiesTable">
                    <thead>
                        <tr>
                            <th className="headerCol" scope="col">Nome attività</th>
                            <th className="headerCol" scope="col">Fascia oraria</th>
                            <th className="headerCol" scope="col">Numero coperti</th>
                            <th className="headerCol" scope="col">Giorni</th>
                            <th className="headerCol" scope="col">Elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows} {/* Renders all the ActivityRow components contained in the dictionary*/}
                    </tbody>
                </table>
            </div>
                <div id="buttonsDiv">
                    <button
                        id="saveChangesButton"
                        type="button"
                        className={"btn btn-primary" + (rowsWithErrors || hasErrors || hasEmptyFields ? " disabled" : "")}>
                        {/*Disable the button if there are validation errors*/}
                        Salva impostazioni
                    </button>
                    <button
                        onClick={this.addActivityRow}
                        id="addActivityButton"
                        type="button"
                        className={"btn btn-outline-primary" + ((rowsWithErrors) ? " disabled" : "")}>
                        {/** The "aggiungi attività" button is enabled only if every row is correct or if there are no rows (so that it is possible to add the first row) */}
                        <i class="bi bi-plus"></i>
                        Aggiungi attività
                    </button>
                </div></>
        )
    }
}