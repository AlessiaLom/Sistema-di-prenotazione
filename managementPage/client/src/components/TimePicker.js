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
            <div style={{ width: "30%", float: "left" }} className="input-group timepicker">
                <input
                    value={this.props.value}
                    onChange={this.props.onChange}
                    id={this.props.id}
                    className="form-control"
                    type="time"
                    name={this.props.name}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    required>
                </input>
            </div>
        )
    }
}