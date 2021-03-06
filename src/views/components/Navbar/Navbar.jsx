import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { logoutHandler, search, itemInCart } from "../../../redux/actions";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    cartQty: "",
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  componentDidMount() {
    // this.renderCartList()
    this.props.itemInCart(this.props.user.id)
  }


  renderCartList = () => {
    Axios.get(`${API_URL}/carts`,{
      params: {
        userId: this.props.user.id
      }
    })
    .then((res) => {
      this.setState({ cartQty: res.data.length })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Cari produk impianmu disini"
            onChange={(e) => this.props.search(e.target.value)}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>
                {
                      this.props.user.role == "admin" ? 
                      <DropdownMenu className="mt-2">
                      <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/dashboard"
                      >
                        Dashboard
                      </Link>
                    </DropdownItem>
                    <Link to="/admin/payment">
                    <DropdownItem>Payments</DropdownItem>
                    </Link>
                    <Link to="/admin/report">
                    <DropdownItem>Report</DropdownItem>
                    </Link>
                  </DropdownMenu> :
                  <DropdownMenu className="mt-2">
                    <Link to="/history">
                    <DropdownItem>History</DropdownItem>
                    </Link>
                  </DropdownMenu>
              
                }
              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {this.props.itemInCart}
                    {/* {this.state.cartQty}*/this.props.user.itemInCart}
                  </small>
                </CircleBg>
              </Link>
              <Link to="/">
                <ButtonUI
                  onClick={this.logoutBtnHandler}
                  className="ml-3"
                  type="textual"
                  >
                  Logout
                </ButtonUI>
              </Link>
            </>
          ) : (
            <>
              <ButtonUI className="mr-3" type="textual">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign in
                </Link>
              </ButtonUI>
              <ButtonUI type="contained">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign up
                </Link>
              </ButtonUI>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onLogout: logoutHandler,
  search,
  itemInCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
