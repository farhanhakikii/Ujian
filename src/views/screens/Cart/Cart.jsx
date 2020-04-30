import React from "react";
import "./Cart.css"
import { connect } from "react-redux";
import Axios from "axios"
import { API_URL } from "../../../constants/API";
import { Link } from 'react-router-dom'

class Cart extends React.Component{
    state = {
        cart: [],
        productName: "",
        price: "",
        isCart: false
    }
    
    componentDidMount(){
        this.coba()
    }
    coba = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
        .then(res => {
            this.setState({cart: res.data, isCart: true})
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    renderCart = () => {
        return this.state.cart.map((val) => {
            return (
                <tr>
                    <td><img src={`${val.product.image}`} alt="" height="100px" width="100px"/></td>
                    <td>{val.product.productName}</td>
                    <td>{val.product.price}</td>
                    <td>{val.quantity} </td>
                    <td><button onClick={() => this.deleteCart(val.id)} className="btn btn-danger">Delete</button></td>
                </tr>
            )
        })
    }
    deleteCart = (id) => {
        Axios.delete(`${API_URL}/carts/${id}`)
        .then(res => {
            this.coba()
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
        <>
        <h1 className="text-center">Cart</h1>
        <table className="table ">
            <thead>
                <tr>
                    <th>Images</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                    {
                        this.state.isCart.length > 0?
                        this.renderCart() : <p>Kosong. <Link to="/"> Ayo Belanja.</Link></p>
                    }
            </tbody>
        </table>
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

export default connect(mapStateToProps)(Cart)