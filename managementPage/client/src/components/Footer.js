import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import "./../styles/sideBar.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * The Footer contains the Logout button on the sidebar
 */
export default class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.onGenerateUrl = this.onGenerateUrl.bind(this)
    }

    onGenerateUrl(){
        navigator.clipboard.writeText("localhost:8000/" + this.props.restaurantId + "/booking")
        toast.success('Link copiato', {
            toastId: 'copied',
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        return (
            <div className="mx-auto align-items-center justify-content-center" id="footerDiv">
                <div>
                    <button type="button" onClick={this.onGenerateUrl} className="btn btn-primary urlGenerator">Genera URL</button>
                </div>
                <div>
                    <button type="button" onClick={this.props.onLogout} className="btn btn-outline-secondary logout">Logout</button>
                </div>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {/* Same as */}
                <ToastContainer />
            </div>
        )
    }
}