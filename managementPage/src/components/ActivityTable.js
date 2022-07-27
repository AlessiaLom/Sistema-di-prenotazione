import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import $ from 'jquery';
import ActivityRow from './ActivityRow';


/**
 * Contains activity rows and manages addition and deletion of rows of the table.
 */
export default class ActivityTable extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - 
         *      -
         */
        super(props)
        this.state = {
            activityRows: [], // Array of ActivityRow components
            lastKey: 0 // keeps track of the last key/uniqueId used and gets incremented each time a new one is used
        }
        this.addActivityRow = this.addActivityRow.bind(this)
        this.deleteActivityRow = this.deleteActivityRow.bind(this)
    }


    /**
     * Adds a row to the activity table
     */
    addActivityRow() {
        // Sets the state with the new array (with one more row) and updates the last key used
        this.setState({
            activityRows: [...this.state.activityRows, <ActivityRow key={this.state.lastKey + 1} uniqueId={this.state.lastKey + 1} onClick={this.deleteActivityRow} />],
            lastKey: this.state.lastKey + 1
        });
    }

    /**
     * Deletes the ActivityRow with uniqueId from the ActivityTable
     * @param {int} uniqueId uniqueId of the row that has to be deleted. Is passed by the ActivityRow when the delete button is pressed
     */
    deleteActivityRow(uniqueId) {
        let activityRows = this.state.activityRows.slice()
        activityRows.forEach((row, index) => {
            if (row.props.uniqueId == uniqueId) { 
                activityRows.splice(index, 1)
                console.log("Riga trovata con uniqueId: " + uniqueId)
            }
        })
        this.setState({
            activityRows: activityRows
        })
    }

    render() {
        return (
            <><div>
                <table id="activitiesTable" className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="headerRow" scope="col">Nome attività</th>
                            <th className="headerRow" scope="col">Fascia oraria</th>
                            <th className="headerRow" cope="col">Preavviso minimo</th>
                            <th className="headerRow" scope="col">Numero coperti</th>
                            <th className="headerRow" scope="col">Giorni</th>
                            <th className="headerRow" scope="col">Elimina</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.activityRows} {/* Renders all the elements within the array (array of ActivityRow components)*/}
                    </tbody>
                </table>
            </div>
                <div id="buttonsDiv">
                    <button id="saveChangesButton" type="button" className="btn btn-primary">Salva modifiche</button>
                    <button onClick={this.addActivityRow} id="addActivityButton" type="button" className="btn btn-outline-primary">Aggiungi attività</button>
                </div></>
        )
    }
}