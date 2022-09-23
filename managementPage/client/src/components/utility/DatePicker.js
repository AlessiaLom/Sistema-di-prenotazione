import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"

/**
 * Represents an input type date element
 *
 * @param value displayed value, dd/mm/yyyy if empty string
 * @param onChange function called on date change
 * @param id input type date id attribute
 * @param name input type date dame attribute
 * @param min minimum selectable date in yyyy-mm-dd format
 * @param max maximum selectable date in yyyy-mm-dd format
 * @param step
 */
export default class DatePicker extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{ width: "30%", float: "left" }} className="input-group timepicker">
                <input
                    type="date"
                    value={this.props.value}
                    onChange={this.props.onChange}
                    id={this.props.id}
                    className="form-control"
                    name={this.props.name}
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                >
                </input>
            </div>
        )
    }
}