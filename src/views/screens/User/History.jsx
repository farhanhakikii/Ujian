import React from 'react'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'

class History extends React.Component{
    state = {
        historyPurchase: []
    }
    componentDidMount(){
        this.getfromTransaction()
    }
    getfromTransaction = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "Complete"
            }
        })
        .then((res) => {
            console.log(res)
            this.setState({historyPurchase: res.data})
            alert(this.state.historyPurchase.length)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    render() {
        return this.state.historyPurchase.map((val) => {
            return <p>val.userId</p>
        })
    }
}

export default History