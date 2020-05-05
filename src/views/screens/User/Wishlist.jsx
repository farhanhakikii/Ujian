//Mirip sama Cart

import React from "react";
import { connect } from "react-redux";
import swal from 'sweetalert'
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";