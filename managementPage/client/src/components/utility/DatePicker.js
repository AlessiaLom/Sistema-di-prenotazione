import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"


/**
 * Represents an input type time element
 */
export default class DatePicker extends React.Component {
    constructor(props) {
        /**
         *  props:
        */
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