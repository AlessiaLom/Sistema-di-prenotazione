import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import $ from 'jquery';
import TimePicker from './TimePicker';
import TextForm from './TextForm';
import DayPicker from './DayPicker';


/**
 * This component represents an activity row inside the ActivityTable. 
 * Everytime the "Aggiungi attività" button is pressed a new ActivityRow is created and added to the table.
 * Everytime the red button is pressed, the row gets deleted and removed from the table.
 */
export default class ActivityRow extends React.Component {
    constructor(props) {
        /*
            props:
                - key: unique key used by react in arrays
                - uniqueId: same as the key but used by us to delete the right row when the button is pressed
                - onClick: function that is fired when the delete button is presses. The function belongs to the ActivityTable parent.
        */
        super(props)

    }

    render() {
        return (

            <tr>
                <th scope="row">
                    <TextForm placeholder="es. Cena" />
                </th>
                <td>
                    <div className='row g-0'>
                        <TimePicker min="00:00" max="23:59" /><TimePicker min="00:00" max="23:59" />
                    </div>

                </td>
                <td>
                    <TextForm placeholder="es. 5" />
                </td>
                <td>
                    <TimePicker min="00:00" max="23:59" />
                </td>
                <td>
                    <DayPicker />
                </td>
                <td>
                    <button onClick={() => this.props.onClick(this.props.uniqueId)} type="button" className="deleteActivityButton btn btn-outline-danger">
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
            </tr>

        )
    }
}