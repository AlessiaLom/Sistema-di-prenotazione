import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import Select from '../utility/Select';

export default class Booking extends React.Component {
    constructor(props) {
        /*
            props:
                
        */
        super(props)
        this.state = {
            booking: this.props.booking
        }
        this.handleChange = this.handleChange.bind(this)
        this.saveNewStatus = this.saveNewStatus.bind(this)
    }

    saveNewStatus(newStatus) {
        fetch("/bookings/save_changes/0001/" + this.state.booking.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                newStatus: newStatus
            })
        })
    }

    handleChange(event) {
        const { name, value } = event.target

        switch (name) {
            case "selectBookingStatus":
                let newBooking = this.state.booking
                newBooking.bookingStatus = value
                this.setState({ booking: newBooking }, () => this.saveNewStatus(value))
                this.props.onChange(this.props.uniqueId, value)
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <tr>
                <td scope="row">
                    {this.state.booking.bookingName}
                </td>
                <td>
                    {this.state.booking.bookingSeats}
                </td>
                <td>
                    {this.state.booking.bookingDate}
                </td>
                <td>
                    {this.state.booking.bookingTime}
                </td>
                <td>
                    {this.state.booking.email}<br></br>
                    {this.state.booking.phone}
                </td>
                <td>
                    <Select
                        name="selectBookingStatus"
                        options={['confirmed', 'pending', 'canceled']}
                        defaultValue={this.state.booking.bookingStatus}
                        onChange={this.handleChange}
                    />
                </td>
            </tr>
        )
    }
}