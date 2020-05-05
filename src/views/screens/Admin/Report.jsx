import React from "react"
import { API_URL } from "../../../constants/API"
import Axios from "axios"

class Report extends React.Component{
    state = {
        listUser: [],
        listItem: [],
    }

    renderTransaction = () => {
        Axios.get(`${API_URL}/transactions`,{
            params: {
                status: "Complete",
                _embed: "transaction_Details",
            }
        })
        .then(res => {
            console.log(res)
            alert(res.data.length)
        })
        .catch(err => {
            console.log(err)
        })
    }

    renderUser = () => {
        Axios.get(`${API_URL}/users`)
        .then(res => {
            console.log(res)
            this.setState({listUser: res.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    renderItem = () => {
        Axios.get(`${API_URL}/products`)
        .then(res => {
            console.log(res)
            this.setState({listItem: res.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    componentDidMount(){
        this.renderTransaction()
        this.renderUser()
        this.renderItem()
    }

    render() {
        return (
            <div>
                <h1>Report Gan</h1>
            </div>
        )
    }
}

export default Report