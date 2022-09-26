import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"

/**
 * Represents an input text area
 */
export default class Select extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - validationError: contains the error message for wrong input, used to color the border of red
         *      - defaultValue: the value of the item that is selcted by default
         *      - options: array of strings representing the options
         *      - onChange: function to be triggered on the option change 
         */
        super(props)
    }

    render() {
        let options =
            this.props.options.map(option =>
            (<option
                key={option}
                value={option}
                // disabled={this.props.disabled}
                // selected={option == this.props.defaultValue}
            >
                {option}
            </option>))
        // console.log(options)
        return (
            <>
                {/*<span className="validationError">{this.props.validationError}</span>*/}
                <select
                    name={this.props.name}
                    value={this.props.defaultValue}
                    className="form-select"
                    aria-label="Default select example"
                    onChange={this.props.onChange}
                >
                    {
                        options
                    }
                </select>
            </>
        )
    }
}