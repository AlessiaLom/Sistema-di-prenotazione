import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import $ from 'jquery';
import ActivityRow from './ActivityRow';

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
            errorsDictionary: {}, // stores validation errors indexed by the key of the row that contains validation errors (key = row's uniqueId, value = boolean)
            lastKey: 0, // keeps track of the last key/uniqueId used and gets incremented each time a new one is used
        }
        this.areThereValidationErrors = this.areThereValidationErrors.bind(this)
        this.addActivityRow = this.addActivityRow.bind(this)
        this.deleteActivityRow = this.deleteActivityRow.bind(this)
        this.manageRowChanges = this.manageRowChanges.bind(this)
    }

    /**
    * Checks if the errorsDictionary contains at least one true value
    * @returns true if there is at least one error
    */
    areThereValidationErrors() {
        let values = getDictionaryValues(this.state.errorsDictionary)
        return values.includes(true) // if at least one dictionary element corresponds to true it means that at least one row contains errors
    }

    /**
     * Updates the errorsDictionary when a row gets modified (one of its fields changes)
     * @param {int} uniqueId uniqueId of the row that changed
     * @param {boolean} hasErrors boolean true if the just modified row contains errors
     */
    manageRowChanges(uniqueId, hasErrors) {
        let newErrorsDictionary = this.state.errorsDictionary // Copy current errors dictionary
        newErrorsDictionary[uniqueId] = hasErrors

        this.setState({
            errorsDictionary: newErrorsDictionary
        })
    }

    /**
     * Adds a row to the activity table
     */
    addActivityRow() {
        // Sets the state with the new rows dictionary, the new errors dictionary and the new key to use for the next row

        let newKey = this.state.lastKey + 1 // Compute new key

        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newErrorsDictionary = this.state.errorsDictionary // Copy current errors dictionary

        // Update the rows dictionary
        newRowsDictionary[newKey] =
            <ActivityRow
                key={newKey}
                uniqueId={newKey}
                onClick={this.deleteActivityRow}
                onChange={this.manageRowChanges} />

        // Update the errors dictionary
        newErrorsDictionary[newKey] = true // The new row is set to contain errors when created because it is empty

        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            errorsDictionary: newErrorsDictionary,
            lastKey: newKey
        });
    }

    /**
     * Deletes the ActivityRow with uniqueId from the ActivityTable
     * @param {int} uniqueId uniqueId of the row that has to be deleted. Is passed by the ActivityRow when the delete button is pressed
     */
    deleteActivityRow(uniqueId) {
        let newRowsDictionary = this.state.rowsDictionary // Copy current rows dictionary
        let newErrorsDictionary = this.state.errorsDictionary // Copy current errors dictionary
        delete newRowsDictionary[uniqueId] // Delete entry from rows dictionary
        delete newErrorsDictionary[uniqueId] // Delete entry from errors dictionary
        // Update the state
        this.setState({
            rowsDictionary: newRowsDictionary,
            errorsDictionary: newErrorsDictionary
        })
    }

    render() {
        let rows = getDictionaryValues(this.state.rowsDictionary)
        let rowsWithErrors = this.areThereValidationErrors()
        return (
            <><div>
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
                        className={"btn btn-primary" + (rowsWithErrors ? " disabled" : "")}>
                        {/*Disable the button if there are validation errors*/}
                        Salva modifiche
                    </button>
                    <button
                        onClick={this.addActivityRow}
                        id="addActivityButton"
                        type="button"
                        className={"btn btn-outline-primary" + ((rowsWithErrors) ? " disabled" : "")}>
                        {/** The "aggiungi attività" button is enabled only if every row is correct or if there are no rows (so that it is possible to add the first row) */}
                        Aggiungi attività
                    </button>
                </div></>
        )
    }
}