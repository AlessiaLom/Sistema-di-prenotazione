import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../../styles/pages.css"
import Select from '../utility/Select';



// Booking structure:
/**
 * id: "f2d6glgryi"
 * bookingDate: "2022-8-24"
 * bookingTime: "20:30"
 * bookingGuests: "3"
 * bookingActivity: "Aperitivo"
 * bookingStatus: "canceled"
 * guestName: "Andrea"
 * guestSurname: "Foschi"
 * guestEmail: "andrea.foschi756@gmail.com"
 * guestPhone: "3312696285"
 * guestAdditionalInfo: "iufhdgapugdfas"
 */

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
        fetch("/bookings/save_changes/" + this.props.restaurantId + "/" + this.state.booking.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                newStatus: newStatus
            })
        }).then((res) => {
            this.props.onChange(this.props.uniqueId, newStatus, res.ok)
        });
    }

    handleChange(event) {
        const {name, value} = event.target

        switch (name) {
            case "selectBookingStatus":
                let newBooking = this.state.booking
                newBooking.bookingStatus = value
                this.setState({booking: newBooking}, () => this.saveNewStatus(value))
                break;
            default:
                break;
        }
    }

    /**
     * Restricts selectable options to the only ones actually feasible
     * @returns {array} array of options to be passed to the select element
     */
    getStatusOptions() {
        switch (this.state.booking.bookingStatus) {
            case 'confirmed':
                return ['confirmed', 'canceled']
            case 'pending':
                return ['confirmed', 'pending', 'canceled']
            case 'canceled':
                return ['canceled']
            default:
                return ['confirmed', 'pending', 'canceled']
        }
    }

    getStatusColor() {
        switch (this.state.booking.bookingStatus) {
            case 'confirmed':
                return "#d9ead3"
            case 'pending':
                return "#fff2cc"
            case 'canceled':
                return "#f4cccc"
            default:
                return ""
        }
    }

    render() {
        let statusOptions = this.getStatusOptions()
        let statusColor = this.getStatusColor()
        return (
            <tr >
                <td scope="row">
                    {this.state.booking.guestName}
                </td>
                <td>
                    {this.state.booking.bookingGuests}
                </td>
                <td>
                    {this.state.booking.bookingDate}
                </td>
                <td>
                    {this.state.booking.bookingTime}
                </td>
                <td>
                    {this.state.booking.guestEmail}<br></br>
                    {this.state.booking.guestPhone}
                </td>
                <td style={{backgroundColor: statusColor}}>
                    <Select
                        name="selectBookingStatus"
                        options={statusOptions}
                        defaultValue={this.state.booking.bookingStatus}
                        onChange={this.handleChange}
                    />
                </td>

            </tr>
        )
    }



}