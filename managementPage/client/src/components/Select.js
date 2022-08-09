import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/pages.css"

/**
 * Represents an input text area
 */
export default class Select extends React.Component {
    constructor(props) {
        /**
         *  props:
         *      - id: id of the html input element
         *      - placeholder: the placeholder of the input text area
         *      - validationError: contains the error message for wrong input, used to color the border of red
         */
        super(props)
    }

    render() {
        let className = "form-control" + (this.props.validationError ? " border-danger" : "")
        let options =
            this.props.options.map(option =>
            (<option
                key={option}
                value={option}
                selected={option == this.props.defaultValue}
            >
                {option}
            </option>))
        // console.log(options)
        return (
            <>
                {/*<span className="validationError">{this.props.validationError}</span>*/}
                <select
                    name={this.props.name}
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