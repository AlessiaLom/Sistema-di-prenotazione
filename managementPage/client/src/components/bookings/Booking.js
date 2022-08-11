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

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target

        switch (name) {
            case "selectBookingStatus":
                fetch("/bookings/save_changes/0001/" + this.props.booking.id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        newStatus: value
                    })
                })
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <tr>
                <td scope="row">
                    {this.props.booking.bookingName}
                </td>
                <td>
                    {this.props.booking.bookingSeats}
                </td>
                <td>
                    {this.props.booking.bookingDate}
                </td>
                <td>
                    {this.props.booking.bookingTime}
                </td>
                <td>
                    {this.props.booking.email}<br></br>
                    {this.props.booking.phone}
                </td>
                <td>
                    <Select 
                        name="selectBookingStatus"
                        options={['confirmed', 'pending', 'canceled']}
                        defaultValue={this.props.booking.bookingStatus}
                        onChange={this.handleChange}
                    />
                </td>
            </tr>
        )
    }
}