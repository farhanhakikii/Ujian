import React from "react";
import "./Cart.css"
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import { itemInCart } from "../../../redux/actions"

class Cart extends React.Component {
  state = {
    cartData: [],
    checkout: false,
    totalPrice: 0,
    penerima: "",
    alamat: "",
    noTelp: "",
    sendCategory: "instant",
    userName: ""
  };

  getCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ cartData: res.data });
        if(res.data.length > 0){
          this.setState({ userName: this.state.cartData })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>
          <td>
            <ButtonUI
              type="outlined"
              onClick={() => this.deleteCartHandler(id)}
            >
              Delete Item
            </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData();
        this.props.itemInCart(this.props.user.id)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getCartData();
  }

  activeCheckout = () => {
    this.setState({ checkout: true })
    var total = 0
    this.state.cartData.map((val => {
      total += (val.quantity*val.product.price)
    }))
    this.setState({ totalPrice: total })
  }
  
  checkOut = () => {
    return this.state.cartData.map((val,idx) => {
      const { quantity, product } = val;
      const { productName, price } = product;
      //   
      return (
          <tr>
          <td>{idx+1}</td>
          <td>{productName}</td>
          <td>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
              })  .format(price)}</td>
          <td>{quantity}</td>
          <td>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
              })  .format(price*quantity)}</td>
          </tr>
      )
    })
  }

  inputHandler = (e,field) => {
    this.setState({[field]: e.target.value})
  }

  priceWithSend = () => {
    if(this.state.sendCategory == "instant"){
      this.setState({ totalPrice: this.state.totalPrice += 200000})
    }else if(this.state.sendCategory == "sameday"){
      this.setState({ totalPrice: this.state.totalPrice += 50000})
    }else if(this.state.sendCategory == "express"){
      this.setState({ totalPrice: this.state.totalPrice += 20000})
    }else if(this.state.sendCategory == "sameday"){
      this.setState({ totalPrice: this.state.totalPrice += 0})
    }
    return this.state.totalPrice
  }

  confirmCheckout = () => {
    const { penerima, alamat, noTelp, totalPrice, cartData, sendCategory } = this.state
    Axios.post(`${API_URL}/transactions`, {
      penerima,
      alamat,
      noTelp,
      status: "Pending",
      sendCategory,
      totalPrice: this.priceWithSend(),
      userName : this.props.user.username,
      userId: this.props.user.id
      // cartData,
    })
    .then(res => {
      console.log(res)
      this.state.cartData.map((val) => {
        Axios.post(`${API_URL}/transaction_Details`, {
          transactionId: res.data.id,
          productName: val.product.productName,
          productId: val.productId,
          quantity: val.quantity,
          price: val.product.price,
          category: val.product.category,
          totalPrice: val.quantity*val.product.price,
        })
        .then(res => {
          Axios.delete(`${API_URL}/carts/${val.id}`)
          .then((res) => {
            this.getCartData();
            this.props.itemInCart(this.props.user.id)
          })
          .catch((err) => {
            console.log(err);
          });    
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })

      })
      alert(`Transaksi Selesai, Total Pembayaran: ${this.state.totalPrice}`)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className="container py-4">
        {this.state.cartData.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderCartData()}
              <tr>
                <td colSpan="5"></td>
                <td><ButtonUI onClick={this.activeCheckout}>Checkout</ButtonUI></td>
              </tr>
            </tbody>
            <tfoot>
              {
              this.state.checkout ? 
              <>
              <td colSpan="5"><h1 className="text-center">Checkout</h1></td>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>

              {this.checkOut()}
              <tr>
              <td colSpan="4" className="text-center">Total Price</td>
              <td>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
              })  .format(this.state.totalPrice)}</td>
              <td>Tipe Pengiriman</td>
              </tr>
              <tr>
                <td colSpan="2"><TextField onChange={(e) => this.inputHandler(e,"penerima")} value={this.state.penerima} placeholder="Nama Penerima"/></td>
                <td colSpan="2"><TextField onChange={(e) => this.inputHandler(e,"alamat")} value={this.state.alamat} placeholder="Alamat"/></td>
                <td colSpan="1"><TextField onChange={(e) => this.inputHandler(e,"noTelp")} value={this.state.noTelp} placeholder="No. Telp"/></td>
                <td colSpan="1">
                  <select className="custom-text-input h-10 pl-3" value={this.state.sendCategory} onChange={(e) => this.inputHandler(e, "sendCategory")}>
                    <option value="instant">Instant - (Total Price + Rp. 200.000,00)</option>
                    <option value="sameday">Same Day - (Total Price + Rp. 50.000,00)</option>
                    <option value="express">Express - (Total Price + Rp. 20.000,00)</option>
                    <option value="economy">Economy - Free</option>
                  </select>
                </td>
              </tr>
              <tr><td colSpan="5"><ButtonUI onClick={this.confirmCheckout}>Confirm</ButtonUI></td></tr>
              </> : null
              }
            </tfoot>
          </Table>
        ) : (
          <Alert>
            Your cart is empty! <Link to="/">Go shopping</Link>
          </Alert>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        cart: state.cart
    }
}

export default connect(mapStateToProps,{itemInCart})(Cart)
