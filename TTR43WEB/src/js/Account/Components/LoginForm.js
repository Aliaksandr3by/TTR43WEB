
import PropTypes from "prop-types";
import React from "react";

import ErrorResult from "./ErrorResult";

const LoginForm = ({ errorUser = [], userData = [], handleChange = null, onSignIn = null, onSignInKeyEnter = null }) => {
    const { Login, Password } = userData;

    const handleStateFunctional = (event) => {
        const tmp =  { [event.target.dataset.role]: event.target.value };
        handleChange(tmp);
    };

    return (
        <div className="row" >
            <form>
                <div className="input-field ">
                    <input className="validate" type="text" data-role="Login" id="Login" value={Login} onChange={handleStateFunctional} onKeyDown={onSignInKeyEnter} />
                    <label htmlFor="Login">Введите Email/Login/Phone</label>
                </div>
                <div className="input-field ">
                    <input className="validate" type="Password" data-role="Password" id="Password" value={Password} onChange={handleStateFunctional} onKeyDown={onSignInKeyEnter} />
                    <label htmlFor="Password">Введите пароль</label>
                </div>
                <div className="input-field ">
                    <button type="button" className="btn" onClick={onSignIn}>Войти</button>
                </div>
                <ErrorResult errorUser={errorUser} />
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    errorUser: PropTypes.array,
    userData: PropTypes.object,
    handleChange: PropTypes.func,
    onSignIn: PropTypes.func,
    onSignInKeyEnter: PropTypes.func,
};

export default LoginForm;