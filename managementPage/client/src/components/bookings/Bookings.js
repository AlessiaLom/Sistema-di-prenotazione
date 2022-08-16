import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import Booking from './Booking';


/**
 * Contains activity rows and manages addition and deletion of rows of the table.
 */
export default class Bookings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bookingsRows: {},
            bookingsValues: {}
        }
    }

    /**
     * Fetches the backend to retrieve information about the activities of the restaurant
     * Sets the state accordingly to what has been received by the databases
     */

    componentDidMount() {
        // Fetch giving the restaurant ID (0001 hardcoded here for tests)
        fetch("/bookings/0001", {
            method: "GET",
            
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    let fetchedBookingsRows = {} // Instantiate the dictionary of booking rows
                    let fetchedBookingsValues = {} // Instantiate the dictionary of booking values

                    // Fill dictionaries with data received from db
                    data.bookings.forEach((booking, index) => { // for each activity in the data.activities array
                        fetchedBookingsRows[index] = // take the index and save a new Activity component in the object, the key of the component will be the index
                            <Booking
                                key={index}
                                uniqueId={index}
                                booking={booking} />
                        fetchedBookingsValues[index] = booking
                    })

                    // Update the state
                    this.setState({
                        bookingsRows: fetchedBookingsRows,
                        bookingsValues: fetchedBookingsValues
                    })
                }
                // console.log(data)
            })
    }

    render() {
        let rows = Object.values(this.state.bookingsRows)
        return (

            <><div>
                <div>
                    <h4>Lista prenotazioni</h4>
                    <hr></hr>
                </div>
                <table id="activitiesTable">
                    <thead>
                        <tr>
                            <th className="headerCol" scope="col">Nome</th>
                            <th className="headerCol" scope="col">Numero coperti</th>
                            <th className="headerCol" scope="col">Giorno</th>
                            <th className="headerCol" scope="col">Ora</th>
                            <th className="headerCol" scope="col">Contatti</th>
                            <th className="headerCol" scope="col">Stato</th>

                        </tr>
                    </thead>
                    {/* Renders all the rows */}
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
                {
                    /*
                     * <div id="buttonsDiv">
                    <button
                        onClick={this.onClick}
                        name="saveChanges"
                        type="button"
                        className={"btn btn-primary" + (rowsWithErrors || hasErrors || hasEmptyFields ? " disabled" : "")}>
                        Salva impostazioni
                    </button>
                    <button
                        onClick={this.addActivityRow}
                        id="addActivityButton"
                        type="button"
                        className={"btn btn-outline-primary" + ((rowsWithErrors) ? " disabled" : "")}>
                        <AiOutlinePlus />
                    </button>
                    </div>
                    */
                }
            </>
        )
    }
}