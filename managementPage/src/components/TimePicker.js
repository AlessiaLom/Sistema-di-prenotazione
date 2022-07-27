import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"
import $ from 'jquery';


/**
 * Represents an input type time element
 */
export default class TimePicker extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - min: the minimum time that can be picked
         *      - max: the maximum time that can be picked
        */
        super(props)
    }

    render() {
        return (
            <div className="input-group timepicker">
                <input className="form-control" type="time" id="appt" name="appt" min={this.props.min} max={this.props.max} required></input>
            </div>
        )
    }
}