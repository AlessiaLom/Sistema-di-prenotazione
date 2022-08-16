import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import TimePicker from '../utility/TimePicker';
import TextForm from '../utility/TextForm';
import DayPicker from '../utility/DayPicker';
import { BsTrash } from 'react-icons/bs'

/**
 * Checks if the two times set by the user are in chronological order (starting time < ending time) or not
 * @param {*} startingTime activity's statrting time
 * @param {*} endingTime activity's ending time
 * @returns true if in chronological order
 */
function checkChronologicalOrder(startingTime, endingTime) {
    if (startingTime.hours > endingTime.hours) {
        return true
    } else if (startingTime.hours == endingTime.hours) {
        if (startingTime.minutes > endingTime.minutes) {
            return true
        }
    } else {
        return false
    }
}


/*
 * This component represents an activity row inside the ActivityTable. 
 * Everytime the "Aggiungi attività" button is pressed a new Activity is created and added to the table.
 * Everytime the red button is pressed, the row gets deleted and removed from the table.
 */
export default class Activity extends React.Component {
    constructor(props) {
        /*
            props:
                - key: unique key used by react in arrays
                - uniqueId: same as the key but used by us to delete the right row when the button is pressed
                - onClick: function that is fired when the delete button is presses. The function belongs to the ActivityTable parent.
                - onChange: function owned by ActivityTable that is fired when some input in the table change, it is used to enable/disable the button if one or more rows contain error
                - activityValues: plain object representing the activity's values. Has the following shape:
                                    activityValues = {
                                            activityName: String,
                                            startingTime: String,
                                            endingTime: String,
                                            availableSpots: int,
                                            days: String
                                        }
        */
        super(props)

        this.state = {
            activityValues: this.props.activityValues,
            validationErrors: {
                activityNameError: '',
                timesError: '',
                availableSpotsError: '',
                daysError: ''
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.checkErrors = this.checkErrors.bind(this)
        this.checkEmptyFields = this.checkEmptyFields.bind(this)
    }

    /**
     * Checks if the row contains errors by checking each error type in the state of the activity
     * @returns true if the rows contains errors
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
     * Checks if are there empty fields in the activity
     * @returns true if there are empty fields, false otherwise
     */
    checkEmptyFields() {
        let activityValues = this.state.activityValues
        for (const field in activityValues) {
            if (activityValues[field].toString().trim() == '') {
                return true
            }
        }
        return false
    }

    /**
     * Handles the change of the input the row contains
     * Checks for validation errors (differentiates for each input)
     * Updates the ActivityTable with its current state regarding errors in the row
     */
    handleChange(event) {
        const { name, value } = event.target
        let newValidationErrors = this.state.validationErrors
        let newActivityValues = this.state.activityValues
        let startingTime
        let endingTime

        // Check which input got changed and performs proper validation checks
        switch (name) {
            case "activityName" + this.props.uniqueId: // Activity name accepts whatever name except empy name
                console.log("changed " + name + " has value " + value)
                if (value && value.trim() != '') { // If activity name has no value, the row contains errors regarding activity name
                    newValidationErrors.activityNameError = ''
                } else {
                    newValidationErrors.activityNameError = 'Campo obbligatorio'
                }

                // Update field value in state dictionary
                newActivityValues.activityName = value
                break;
            case 'availableSpots' + this.props.uniqueId:
                console.log("changed " + name + " has value " + value)
                if (Number.isInteger(Number(value)) && Number(value) > 0) {
                    newValidationErrors.availableSpotsError = ''
                } else {
                    newValidationErrors.availableSpotsError = 'Inserisci un numero positivo'
                }

                // Update field value in state dictionary
                newActivityValues.availableSpots = value
                break
            case 'startingTime' + this.props.uniqueId:
                // Parse starting time
                startingTime = {
                    hours: parseInt(value.split(":")[0]),
                    minutes: parseInt(value.split(":")[1])
                }

                console.log("changed " + name + " has value " + startingTime.hours + ":" + startingTime.minutes)

                // Update field value in state dictionary
                newActivityValues.startingTime = value

                // get endingTime value to perform checkings
                endingTime = newActivityValues.endingTime
                if (endingTime) {
                    if (checkChronologicalOrder(startingTime, endingTime)) {
                        newValidationErrors.timesError = "Rispettare ordine cronologico"
                    } else {
                        newValidationErrors.timesError = ''
                    }
                }
                break;
            case 'endingTime' + this.props.uniqueId:
                endingTime = {
                    hours: parseInt(value.split(":")[0]),
                    minutes: parseInt(value.split(":")[1])
                }

                console.log("changed " + name + " has value " + endingTime.hours + ":" + endingTime.minutes)

                // Update field value in state dictionary
                newActivityValues.endingTime = value

                // get endingTime value to perform checkings
                startingTime = newActivityValues.startingTime
                if (startingTime) {
                    if (checkChronologicalOrder(startingTime, endingTime)) {
                        newValidationErrors.timesError = "Rispettare ordine cronologico"
                    } else {
                        newValidationErrors.timesError = ''
                    }
                }
                break;
            case 'dayPicker' + this.props.uniqueId:
                let days = newActivityValues.days
                if (days.includes(value)) {
                    days = days.replace(value, '')
                } else {
                    days += value
                }
                if (days == '') {
                    newValidationErrors.daysError = 'Seleziona almeno un giorno'
                } else {
                    newValidationErrors.daysError = ''
                }
                console.log("changed " + name + " days picked: " + days)
                newActivityValues.days = days
                break;
            default:
                break;
        }

        // Update the state
        this.setState({
            activityValues: newActivityValues,
            validationErrors: newValidationErrors
        })

        // Check if the row contains errors after the change
        let hasErrors = this.checkErrors()
        let hasEmptyFields = this.checkEmptyFields()

        // Call the ActivityTable.manageRowChanges(uniqueId, hasErrors) to update the parent regarding current row's validation errors
        // Buttons in ActivityTable will be disabled if the row contains errors or if some fields are empty (or if both conditions happen)
        this.props.onChange(this.props.uniqueId, hasErrors || hasEmptyFields, this.state.activityValues)
    }

    render() {
        return (
            <tr>
                <td scope="row" style={{ width: "5%" }}>
                    <TextForm
                        value={this.state.activityValues.activityName}
                        name={"activityName" + this.props.uniqueId}
                        placeholder="es. Cena"
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.activityNameError}
                    />
                </td>
                <td style={{ width: "25%" }}>
                    <div style={{ display: "inline" }}>
                        <span className="validationError">{this.state.validationErrors.timesError}</span>
                        <p style={{ float: "left" }}> Dalle: </p>
                        <TimePicker
                            value={this.state.activityValues.startingTime}
                            onChange={this.handleChange}
                            name={"startingTime" + this.props.uniqueId}
                            min="00:00"
                            max="23:59"
                        />
                        <p style={{ float: "left" }}> Alle: </p>
                        <TimePicker
                            value={this.state.activityValues.endingTime}
                            onChange={this.handleChange}
                            name={"endingTime" + this.props.uniqueId}
                            min="00:00"
                            max="23:59" />
                    </div>
                </td>
                <td style={{ width: "10%" }}>
                    <TextForm
                        value={this.state.activityValues.availableSpots}
                        name={"availableSpots" + this.props.uniqueId}
                        placeholder="es. 5"
                        onChange={this.handleChange}
                        validationError={this.state.validationErrors.availableSpotsError} />
                </td>
                <td style={{ width: "10%" }}>
                    <DayPicker
                        checkedOnes={this.state.activityValues.days}
                        validationError={this.state.validationErrors.daysError}
                        name={"dayPicker" + this.props.uniqueId}
                        onChange={this.handleChange} />
                </td>
                <td style={{ width: "10%" }}>
                    <button
                        onClick={() => this.props.onClick(this.props.uniqueId)}
                        type="button"
                        className="deleteActivityButton btn btn-outline-danger">
                        <BsTrash />
                    </button>
                </td>
            </tr>
        )
    }
}