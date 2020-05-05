//pada admin kasih tombol confirm buat ganti status pending -> done di transaction detail.(patch)
import React from "react";
import { connect } from "react-redux";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";

class Cart extends React.Component {
  state = {
        pendingPayment: [],
        completePayment: [],
    };

    getPendingPayment = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "Pending",
                _embed: "users",
            }
        })
          .then((res) => {
            console.log(res.data);
            this.setState({ pendingPayment: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      };

    getCompletePayment = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "Complete",
                _embed: "users",
            }
        })
        .then((res) => {
            console.log(res.data);
            this.setState({ completePayment: res.data });
        })
        .catch((err) => {
            console.log(err);
        });
    };

    acceptPayment = (idx) => {
        Axios.patch(`${API_URL}/transactions/${idx}`, {
            status: "Complete",
        })
        .then(res => {
            this.getPendingPayment()
            this.getCompletePayment()
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }
    
  renderPendingPayment = () => {
    return this.state.pendingPayment.map((val, idx) => {
      const { totalPrice, userId } = val;
      //const { userId } = cartData;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{userId}</td>
          <td>{totalPrice}</td>
          <td><ButtonUI>Detail</ButtonUI></td>
          <td><ButtonUI type="outlined" onClick={() => this.acceptPayment(val.id)}>Confirm Payment</ButtonUI></td>
        </tr>
      );
    });
  };

  renderCompletePayment = () => {
    return this.state.completePayment.map((val, idx) => {
      const { totalPrice, userId } = val;
      //const { userId } = cartData;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{userId}</td>
          <td>{totalPrice}</td>
          <td><ButtonUI>Detail</ButtonUI></td>
        </tr>
      );
    });
  };

  componentDidMount() {
    this.getPendingPayment();
    this.getCompletePayment();
  }


  render() {
    return (
      <div className="container py-4">
          <div>
              <h2>Pending Payment</h2>
              {this.state.pendingPayment.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Username</th>
                            <th>Total Price</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPendingPayment()}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </Table>
                ) : (
                <Alert>
                Pending Transaction is empty!
                </Alert>
            )}
          </div>
          <div>
              <h2>Complete Payment</h2>
              {this.state.completePayment.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Username</th>
                            <th>Total Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderCompletePayment()}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </Table>
                ) : (
                <Alert>
                Complete Transaction is empty!
                </Alert>
            )}
          </div>
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

export default connect(mapStateToProps)(Cart)


