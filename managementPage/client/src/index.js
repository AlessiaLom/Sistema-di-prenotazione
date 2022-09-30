import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from "react-router-dom"


/**
 * ManagementApp renders the whole app 
 */
class ManagementApp extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        return (
            //<React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            //</React.StrictMode>
        )
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ManagementApp />);
