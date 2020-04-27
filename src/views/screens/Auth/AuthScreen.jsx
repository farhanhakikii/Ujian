import React from 'react'
import TextField from '../../components/TextField/TextField'
import ButtonUI from '../../components/Button/Button'

class AuthScreen extends React.Component{
    render() {
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-5">
                        <h3>Log In</h3>
                        <p className="mt-4">
                            Welcome back,<br/>Please login to your account
                        </p>
                        <TextField placeholder="Username" className="mt-5"/>
                        <TextField placeholder="Password" className="mt-2"/>
                        <div className="d-flex justify-content-center">
                            <ButtonUI type="contained" className="mt-5 align-self-center">Login</ButtonUI>                        
                        </div>
                    </div>
                    <div className="col-7">
                        <h3>Image</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthScreen