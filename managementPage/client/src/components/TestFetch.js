import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/pages.css"

/**
 * Represents an input text area
 */
export default class TestFetch extends React.Component {
    constructor(props) {
        /**
         *  props:
         * 
         */
        super(props)
        this.state = {
            message: ""
        }
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        fetch("/record", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    message: JSON.stringify(data)
                })
                console.log(data)
            })
    }


    render() {
        return (
            <>
                <div>Ciao regaz</div>
                <p>{this.state.message}</p>
            </>
        )
    }
}