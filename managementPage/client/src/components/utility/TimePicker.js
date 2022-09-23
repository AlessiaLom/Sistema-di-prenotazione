import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"


/**
 * Represents an input type time element
 *
 * @param value displayed value, --:-- if empty string
 * @param onChange function called on time change
 * @param id input type time id attribute
 * @param name input type time dame attribute
 * @param min minimum selectable time in hh:mm format
 * @param max maximum selectable time in hh:mm format
 * @param step
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