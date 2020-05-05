import React from "react";
import { connect } from "react-redux";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";

class History extends React.Component{
    state = {
        historyPurchase: [],
        historyDetails: [],
        isHistoryDetails: false
    }
    componentDidMount(){
        this.getfromTransaction()
    }
    getfromTransaction = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "Complete",
                userName: this.props.user.username,
            }
        })
        .then((res) => {
            console.log(res)
            this.setState({historyPurchase: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    renderHistory = () => {
        return this.state.historyPurchase.map((val, idx) => {
            return <tr>
                <td>{idx + 1}</td>
                <td>{val.penerima}</td>
                <td>{val.totalPrice}</td>
                <td>{val.sendCategory}</td>
                <td>{val.status}</td>
                <td><ButtonUI onClick={() => {this.renderDetailHistory(val.id)}}>Details</ButtonUI></td>
            </tr>
        })
    }
    renderDetailHistory = (idx) => {
        Axios.get(`${API_URL}/transaction_Details`,{
            params: {
                transactionId: idx,
                _expand: "product",
            }
        })
        .then(res => {
            console.log(res)
            this.setState({historyDetails: res.data, isHistoryDetails: true})
            // alert(this.state.historydetails[1].price)
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
        <>
        <h1 className="text-center">History</h1>
        <Table>
            <thead>
                <tr>
                    <td>No</td>
                    <td>Penerima</td>
                    <td>Total Belanja</td>
                    <td>Pengiriman</td>
                    <td>Status</td>
                    <td>Action</td>
                </tr>
            </thead>
            <tbody>
                {this.renderHistory()}
            </tbody>
        </Table>
        <h1 className="text-center">Details</h1>
        <div className="text-center">
            <tr>
                <td>Nama Produk</td>
                <td>ID Produk</td>
                <td>Harga Produk</td>
                <td>Jumlah Pembelian</td>
                <td>Total Harga</td>
            </tr>
        {
                    this.state.isHistoryDetails?
                    this.state.historyDetails.map((val) => {
                        return <tr>
                            <td>{val.product.productName}</td>
                            <td>{val.productId}</td>
                            <td>{val.price}</td>
                            <td>{val.quantity}</td>
                            <td>{val.totalPrice}</td>
                        </tr>
                    }) : null
                }
        </div>
        </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        cart: state.cart
    }
}

export default connect(mapStateToProps)(History)