import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./../styles/pages.css"

/**
 * The DayPicker component is used to select the days a certain activiy takes places for a restaurant
 */
export default class DayPicker extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <span className="validationError">{this.props.validationError}</span>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="L"></input>
                    <label className="form-check-label" >L</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="Ma"></input>
                    <label className="form-check-label" >Ma</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="Me"></input>
                    <label className="form-check-label" >Me</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="G"></input>
                    <label className="form-check-label" >G</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="V"></input>
                    <label className="form-check-label" >V</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="S"></input>
                    <label className="form-check-label" >S</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={this.props.onChange}
                        name={this.props.name}
                        value="D"></input>
                    <label className="form-check-label" >D</label>
                </div>
            </div>
        )
    }
}