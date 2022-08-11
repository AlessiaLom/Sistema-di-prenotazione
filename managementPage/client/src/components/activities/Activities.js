import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import Activity from './Activity';
import Select from '../utility/Select';
import TextForm from '../utility/TextForm';
import { AiOutlinePlus } from 'react-icons/ai'
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
export default class Activities extends React.Component {
    constructor(props) {
        /**
         *  props: no props
         */
        super(props)
        this.state = {
            rowsDictionary: {}, // stores rows indexed by their keys as it is a dictionary (key = row's uniqueId, value = Activity)
            rowsFieldsValues: {}, // stores values of rows with key uniqueid, useful when the save changes button is pressed otherwise the table doesn't have the values of the rows to submit (the rowsDictionary doesn't update row's values when they change)
            rowsErrorsDictionary: {}, // stores validation errors indexed by the key of the row that contains validation errors (key = row's uniqueId, value = boolean)
            lastKey: 0, // keeps track of the last key/uniqueId used and gets incremented each time a new one is used
            validationErrors: {
                bookingThresholdError: ''
            },
            required: [],
            fieldsValues: {
                bookingForewarning: '',
                bookingThreshold: '',
                bookingOffset: '15 min'
            }
        }
        this.areThereValidationErrors = this.areThereValidationErrors.bind(this)
        this.addActivity = this.addActivity.bind(this)
        this.deleteActivity = this.deleteActivity.bind(this)
        this.manageRowChanges = this.manageRowChanges.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.checkErrors = this.checkErrors.bind(this)
        this.checkEmptyFields = this.checkEmptyFields.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    /**
     * Fetches the backend to retrieve information about the activities of the restaurant
     * Sets the state accordingly to what has been received by the databases
     */

    componentDidMount() {
        // Fetch giving the restaurant ID (0001 hardcoded here for tests)
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
                    let fetchedRowsDictionary = {} // Instantiate the dictionary of rows
                    let fetchedRowsErrorsDictionary = {} // Instantiate the dictionary of rows' errors
                    let fetchedRowsFieldsValues = {} // Will contain the rows values 

                    // Fill dictionaries with data received from db
                    data.activities.forEach((activity, index) => { // for each activity in the data.activities array
                        fetchedRowsDictionary[index] = // take the index and save a new Activity component in the object, the key of the component will be the index
                            <Activity
                                key={index}
                                uniqueId={index}
                                onClick={this.deleteActivity}
                                onChange={this.manageRowChanges}
                                activityName={activity.activityName}
                                startingTime={activity.startingTime}
                                endingTime={activity.endingTime}
                                availableSpots={activity.availableSpots}
                                days={activity.days} />
                        fetchedRowsErrorsDictionary[index] = false // Save that the row han no errors, the key will be the index
                        fetchedRowsFieldsValues[index] = {
                            activityName: activity.activityName,
                            startingTime: activity.startingTime,
                            endingTime: activity.endingTime,
                            availableSpots: activity.availableSpots,
                            days: activity.days
                        }

                    })
                    // Take other fields' values
                    let fetchedBookingForewarning = data.bookingForewarning
                    let fetchedBookingThreshold = data.bookingThreshold
                    let fetchedBookingOffset = data.bookingOffset

                    // Update the state
                    this.setState({
                        rowsDictionary: fetchedRowsDictionary,
                        rowsErrorsDictionary: fetchedRowsErrorsDictionary,
                        rowsFieldsValues: fetchedRowsFieldsValues,
                        lastKey: data.activities.length - 1, // Set the last key used to the last index used in the rows above
                        fieldsValues: { // Save fields values
                            bookingForewarning: fetchedBookingForewarning,
                            bookingThreshold: fetchedBookingThreshold,
                            bookingOffset: fetchedBookingOffset
                        }
                    })
                }
                // console.log(data)
            })
    }


    onClick(event) {
        const { name, value } = event.target
        switch (name) {
            case "saveChanges":
                fetch('/activities/save_changes/0001', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bookingForewarning: this.state.fieldsValues.bookingForewarning,
                        bookingThreshold: this.state.fieldsValues.bookingThreshold,
                        bookingOffset: this.state.fieldsValues.bookingOffset,
                        activities: Object.values(this.state.rowsFieldsValues),
                    })
                });
                break;
            default:
                break;
        }
    }

    /**
     * Checks among the required fields if some of them are empty.
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
            case "selectBookingForewarning": // There is no validation error on the minumum notice selection
                console.log("changed " + name + " has value " + value)
                // Update field value in state dictionary
                newFieldsValues.bookingForewarning = value
                break;
            case "bookingThreshold":
                console.log("changed " + name + " has value " + value)
                if (Number.isInteger(Number(value)) && Number(value) > 0) {
                    newValidationErrors.bookingThresholdError = ''
                } else {
                    newValidationErrors.bookingThresholdError = 'Inserisci un numero positivo'
                }

                // Update field value in state dictionary
                newFieldsValues.bookingThreshold = value
                break
            case "selectBookingOffset":
                console.log("changed " + name + " has value " + value)
                newFieldsValues.bookingOffset = value
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
    manageRowChanges(uniqueId, hasErrors, rowFieldsValues) {
        let newRowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary
        newRowsErrorsDictionary[uniqueId] = hasErrors // Save if the row has errors or not
        let newRowsFieldsValues = this.state.rowsFieldsValues // Put rows values in the dictionary
        newRowsFieldsValues[uniqueId] = rowFieldsValues


        this.setState({
            rowsErrorsDictionary: newRowsErrorsDictionary,
            rowsFieldsValues: newRowsFieldsValues
        })
    }

    /**
     * Adds a row to the activity table
     */
    addActivity() {
        // Sets the state with the new rows dictionary, the new errors dictionary and the new key to use for the next row

        let newKey = this.state.lastKey + 1 // Compute new key

        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newRowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary
        let newRowsFieldsValues = this.state.rowsFieldsValues

        // Update the rows dictionary
        newRowsDictionary[newKey] =
            <Activity
                key={newKey}
                uniqueId={newKey}
                onClick={this.deleteActivity}
                onChange={this.manageRowChanges}
                activityName=''
                startingTime=''
                endingTime=''
                availableSpots=''
                days='' />

        // Update the errors dictionary
        newRowsErrorsDictionary[newKey] = true // The new row is set to contain errors when created because it is empty
        newRowsFieldsValues[newKey] = {
            activityName: '',
            startingTime: '',
            endingTime: '',
            availableSpots: '',
            days: ''
        }

        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            rowsErrorsDictionary: newRowsErrorsDictionary,
            rowsFieldsValues: newRowsFieldsValues,
            lastKey: newKey
        });
    }

    /**
     * Deletes the Activity with uniqueId from the ActivityTable
     * @param {int} uniqueId uniqueId of the row that has to be deleted. Is passed by the Activity when the delete button is pressed
     */
    deleteActivity(uniqueId) {
        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newRowsErrorsDictionary = this.state.rowsErrorsDictionary // Copy current errors dictionary
        let newRowsFieldsValues = this.state.rowsFieldsValues
        delete newRowsDictionary[uniqueId] // Delete entry from rows dictionary
        delete newRowsErrorsDictionary[uniqueId] // Delete entry from errors dictionary
        delete newRowsFieldsValues[uniqueId]
        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            rowsErrorsDictionary: newRowsErrorsDictionary,
            rowsFieldsValues: newRowsFieldsValues
        })
    }

    render() {
        let rows = getDictionaryValues(this.state.rowsDictionary)
        let rowsWithErrors = this.areThereValidationErrors() // true or false
        // Check if are there errors in the fields not included in the rows (eg. bookingThreshold)
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
                        name="selectBookingForewarning"
                        options={new Array("Nessun preavviso", "1:00h", "1:30h", "2:00h", "2:30h", "3:00h", "3:30h")}
                        defaultValue={this.state.fieldsValues.bookingForewarning}
                    />
                    <br></br>
                    <h6>Soglia per conferma automatica</h6>
                    <p>La soglia per la conferma automatica rappresenta il numero
                        di coperti entro il quale la conferma della prenotazione
                        è inviata automaticamente al cliente ed oltre il quale la
                        conferma sarà manuale da parte del ristoratore</p>
                    <TextForm
                        value={this.state.fieldsValues.bookingThreshold}
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.bookingThresholdError}
                        name="bookingThreshold"
                        placeholder="es. 5"
                    />
                    <br></br>
                    <h6>Duarata prenotazione</h6>
                    <p>La durata della prenotazione rappresenta la durata della
                        permanenza del cliente presso il ristorante e, di conseguenza,
                        definisce anche ad intervalli di quanto tempo è possibile prenotare
                        (es. è possibile prenotare ad intervalli di 30 min).
                    </p>
                    <Select
                        defaultValue={this.state.fieldsValues.bookingOffset}
                        onChange={this.handleChange}
                        name="selectBookingOffset"
                        options={new Array("15 min", "30 min", "45 min", "1 h")}
                    />
                </div>
                <br></br>
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
                    {/* Renders all the rows */}
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
                <div id="buttonsDiv">
                    <button
                        onClick={this.onClick}
                        name="saveChanges"
                        type="button"
                        className={"btn btn-primary" + (rowsWithErrors || hasErrors || hasEmptyFields ? " disabled" : "")}>
                        {/*Disable the button if there are validation errors*/}
                        Salva impostazioni
                    </button>
                    <button
                        onClick={this.addActivity}
                        id="addActivityButton"
                        type="button"
                        className={"btn btn-outline-primary" + ((rowsWithErrors) ? " disabled" : "")}>
                        {/** The "aggiungi attività" button is enabled only if every row is correct or if there are no rows (so that it is possible to add the first row) */}
                        <AiOutlinePlus />
                    </button>
                </div></>
        )
    }
}