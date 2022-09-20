import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import DatePicker from '../utility/DatePicker';
import Select from '../utility/Select';
import "./../../styles/pages.css"
import { FiFilter } from 'react-icons/fi'
import { GrRevert } from 'react-icons/gr'

/**
 * Filter bar where the user can set several different filters and filter bookings
 */
export default class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: {
                fromDate: '',
                toDate: '',
                fromTime: '',
                toTime: '',
                status: ''
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target
        let newFilters = this.state.filters

        switch (name) {
            case 'fromDateFilter':
                newFilters.fromDate = value
                break;
            case 'toDateFilter':
                newFilters.toDate = value
                break
            case 'statusFilter':
                newFilters.status = value
                break;
            default:
                break;
        }

        // Update the state
        this.setState({
            filters: newFilters
        })
    }

    onClick(event) {
        const { name, value } = event.target
        switch (name) {
            case 'applyFilter':
                this.props.onClick(this.state.filters)
                break;
            case 'clearFilter':
                this.setState({
                    filters: {
                        fromDate: '',
                        toDate: '',
                        fromTime: '',
                        toTime: '',
                        status: ''
                    }
                }, () => {
                    this.props.onClick(this.state.filters)
                })
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <>
                <div>
                    <table id ="filters">
                        <thead>
                            <tr>
                                <td>Dal:</td>
                                <td>Al:</td>
                                <td>Stato:</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            <td>
                                <DatePicker
                                    value={this.state.fromDate}
                                    onChange={this.handleChange}
                                    id="fromDateFilter"
                                    className="form-control"
                                    name="fromDateFilter"
                                    min="2022-01-01"
                                    max="2030-12-31"
                                />
                            </td>
                            <td>
                                <DatePicker
                                    value={this.state.toDate}
                                    onChange={this.handleChange}
                                    id="toDateFilter"
                                    className="form-control"
                                    name="toDateFilter"
                                    min="2022-01-01"
                                    max="2030-12-31"
                                />
                            </td>
                            <td>
                                <Select
                                    name="statusFilter"
                                    options={['Seleziona', 'confirmed', 'pending', 'canceled']}
                                    defaultValue={this.state.filters.status}
                                    onChange={this.handleChange}
                                />
                            </td>
                            <td>
                                <button
                                    onClick={this.onClick}
                                    name="applyFilter"
                                    type="button"
                                    className="btn btn-primary">
                                    {/*Disable the button if there are validation errors*/}
                                    Filtra
                                    <FiFilter />
                                </button>
                                <button
                                    onClick={this.onClick}
                                    name="clearFilter"
                                    type="button"
                                    className="btn btn-light">
                                    {/*Disable the button if there are validation errors*/}
                                    Ripristina
                                    <GrRevert />
                                </button>
                            </td>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}