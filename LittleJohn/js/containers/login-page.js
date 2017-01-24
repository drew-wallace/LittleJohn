import React from 'react';
import { connect } from 'react-redux';

import { login } from '../actions'

import Login from '../components/login';

const mapStateToProps = (state) => {
    return {
		robinhood: state.robinhood,
        primaryColor: state.primaryColor
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
		login: () => {
			dispatch(login());
		}
    }
}

const LoginPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default LoginPage;