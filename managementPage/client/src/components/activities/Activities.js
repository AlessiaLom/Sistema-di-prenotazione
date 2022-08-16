import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import Activity from './Activity';
import Select from '../utility/Select';
import TextForm from '../utility/TextForm';
import { AiOutlinePlus } from 'react-icons/ai'

/**
 * Contains activity activities and manages addition and deletion of activities of the table.
 */
export default class Activities extends React.Component {
    constructor(props) {
        /**
         *  props: no props
         */
        super(props)
        this.state = {
            activitiesDictionary: {}, // stores activities (actual react components) indexed by their keys as in a dictionary (key = activity's uniqueId, value = <Activity />)
            activitiesValues: {}, // Stores Activity's fields values. Since the Activities component doesn't know the changes made to its Activity children, we need to pass the fields values from the child to the parent and we save them in this structure.
            activitiesErrorsDictionary: {}, // stores validation errors indexed by the key of the activity that contains validation errors (key = activity's uniqueId, value = boolean)
            lastKey: 0, // keeps track of the last key/uniqueId used and gets incremented each time a new one is used
            validationErrors: { // Keeps track of validation errors on fields of the Activities page
                bookingThresholdError: ''
            },
            required: [], // Stores the names of the fields that are required
            fieldsValues: { // Stores the values of the fields of the Activities page
                bookingForewarning: '',
                bookingThreshold: '',
                bookingOffset: ''
            }
        }

        // Function binding
        this.areThereValidationErrors = this.areThereValidationErrors.bind(this)
        this.addActivity = this.addActivity.bind(this)
        this.deleteActivity = this.deleteActivity.bind(this)
        this.manageActivityChanges = this.manageActivityChanges.bind(this)
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
                    let fetchedActivitiesDictionary = {} // Instantiate the dictionary of activities
                    let fetchedActivitiesErrorsDictionary = {} // Instantiate the dictionary of activities' errors
                    let fetchedActivitiesValues = {} // Will contain the activities values 

                    // Fill dictionaries with data received from db
                    data.activities.forEach((activity, index) => { // for each activity in the data.activities array
                        fetchedActivitiesDictionary[index] = // take the index and save a new Activity component in the object, the key of the component will be the index
                            <Activity
                                key={index}
                                uniqueId={index}
                                onClick={this.deleteActivity}
                                onChange={this.manageActivityChanges}
                                activityValues={activity} />
                        fetchedActivitiesErrorsDictionary[index] = false // Save that the activity han no errors, the key will be the index
                        fetchedActivitiesValues[index] = activity // Save activity values in the dictionarys

                    })
                    // Take other fields' values
                    let fetchedBookingForewarning = data.bookingForewarning
                    let fetchedBookingThreshold = data.bookingThreshold
                    let fetchedBookingOffset = data.bookingOffset

                    // Update the state
                    this.setState({
                        activitiesDictionary: fetchedActivitiesDictionary,
                        activitiesErrorsDictionary: fetchedActivitiesErrorsDictionary,
                        activitiesValues: fetchedActivitiesValues,
                        lastKey: data.activities.length - 1, // Set the last key used to the last index used in the activities above
                        fieldsValues: { // Save fields values
                            bookingForewarning: fetchedBookingForewarning,
                            bookingThreshold: fetchedBookingThreshold,
                            bookingOffset: fetchedBookingOffset
                        }
                    })
                }
            })
    }


    /**
     * Handles click on the "Salva impostazioni" button 
     * Sends post request to db for saving changes to the page
     * @param {*} event event triggered by the click on a button 
     */
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
                        activities: Object.values(this.state.activitiesValues), // Array containing the values of the activitiesValues
                    })
                });
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
     * Checks whether the fields contain validation errors or not
     * @returns true if there are validation errors in the page's field
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
            case "selectBookingForewarning": // There is no validation error on the minumum notice selection
                // console.log("changed " + name + " has value " + value)
                // Update field value in state dictionary
                newFieldsValues.bookingForewarning = value
                break;
            case "bookingThreshold":
                // console.log("changed " + name + " has value " + value)
                if (Number.isInteger(Number(value)) && Number(value) > 0) {
                    newValidationErrors.bookingThresholdError = ''
                } else {
                    newValidationErrors.bookingThresholdError = 'Inserisci un numero positivo'
                }

                // Update field value in state dictionary
                newFieldsValues.bookingThreshold = value
                break
            case "selectBookingOffset":
                // console.log("changed " + name + " has value " + value)
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
    * Checks if the activitiesErrorsDictionary contains at least one true value
    * Used to enable/disable the "Salva impostazioni" button
    * @returns true if there is at least one error
    */
    areThereValidationErrors() {
        let values = Object.values(this.state.activitiesErrorsDictionary)
        return values.includes(true) // if at least one dictionary element corresponds to true it means that at least one activity contains errors
    }

    /**
     * Updates the activitiesErrorsDictionary when a activity gets modified (one of its fields changes)
     * @param {int} uniqueId uniqueId of the activity that changed
     * @param {boolean} hasErrors boolean true if the just modified activity contains errors
     */
    manageActivityChanges(uniqueId, hasErrors, activityValues) {
        let newActivitiesErrorsDictionary = this.state.activitiesErrorsDictionary // Copy current errors dictionary
        newActivitiesErrorsDictionary[uniqueId] = hasErrors // Save if the activity has errors or not
        let newActivitiesValues = this.state.activitiesValues // Put activities values in the dictionary
        newActivitiesValues[uniqueId] = activityValues

        this.setState({
            activitiesErrorsDictionary: newActivitiesErrorsDictionary,
            activitiesValues: newActivitiesValues
        })
    }

    /**
     * Adds a activity to the activities table
     */
    addActivity() {
        // Sets the state with the new activities dictionary, the new errors dictionary and the new key to use for the next activity

        let newKey = this.state.lastKey + 1 // Compute new key

        let newActivitiesDictionary = this.state.activitiesDictionary // Copy current activities dictionary
        let newActivitiesErrorsDictionary = this.state.activitiesErrorsDictionary // Copy current errors dictionary
        let newActivitiesValues = this.state.activitiesValues

        let emptyActivity = {
            activityName: '',
            startingTime: '',
            endingTime: '',
            availableSpots: '',
            days: ''
        }

        // Update the activities dictionary
        newActivitiesDictionary[newKey] =
            <Activity
                key={newKey}
                uniqueId={newKey}
                onClick={this.deleteActivity}
                onChange={this.manageActivityChanges}
                activityValues={emptyActivity}
            />

        // Update the errors dictionary
        newActivitiesErrorsDictionary[newKey] = true // The new activity is set to contain errors when created because it is empty
        newActivitiesValues[newKey] = emptyActivity

        // Update the state
        this.setState({
            activitiesDictionary: newActivitiesDictionary,
            activitiesErrorsDictionary: newActivitiesErrorsDictionary,
            activitiesValues: newActivitiesValues,
            lastKey: newKey
        });
    }

    /**
     * Deletes the Activity with uniqueId from the ActivityTable
     * @param {int} uniqueId uniqueId of the activity that has to be deleted. Is passed by the Activity when the delete button is pressed
     */
    deleteActivity(uniqueId) {
        let newActivitiesDictionary = this.state.activitiesDictionary // Copy current activities dictionary
        let newActivitiesErrorsDictionary = this.state.activitiesErrorsDictionary // Copy current errors dictionary
        let newActivitiesValues = this.state.activitiesValues
        delete newActivitiesDictionary[uniqueId] // Delete entry from activities dictionary
        delete newActivitiesErrorsDictionary[uniqueId] // Delete entry from errors dictionary
        delete newActivitiesValues[uniqueId]
        // Update the state
        this.setState({
            activitiesDictionary: newActivitiesDictionary,
            activitiesErrorsDictionary: newActivitiesErrorsDictionary,
            activitiesValues: newActivitiesValues
        })
    }

    render() {
        let activities = Object.values(this.state.activitiesDictionary)
        let activitiesWithErrors = this.areThereValidationErrors() // true or false
        // Check if are there errors in the fields not included in the activities (eg. bookingThreshold)
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
                    {/* Renders all the activities */}
                    <tbody>
                        {activities}
                    </tbody>
                </table>
            </div>
                <div id="buttonsDiv">
                    <button
                        onClick={this.onClick}
                        name="saveChanges"
                        type="button"
                        className={"btn btn-primary" + (activitiesWithErrors || hasErrors || hasEmptyFields ? " disabled" : "")}>
                        {/*Disable the button if there are validation errors*/}
                        Salva impostazioni
                    </button>
                    <button
                        onClick={this.addActivity}
                        id="addActivityButton"
                        type="button"
                        className={"btn btn-outline-primary" + ((activitiesWithErrors) ? " disabled" : "")}>
                        {/** The "aggiungi attività" button is enabled only if every activity is correct or if there are no activities (so that it is possible to add the first activity) */}
                        <AiOutlinePlus />
                    </button>
                </div></>
        )
    }
}