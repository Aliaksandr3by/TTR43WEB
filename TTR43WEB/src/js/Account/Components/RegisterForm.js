
import PropTypes from "prop-types";
import React from "react";

import ErrorResult from "./ErrorResult";

const RegisterForm = ({ errorUser = [], userRegister = [], handleStateFunctional = null, onResetClick = null, onSignUpRegister = null }) => {
    const { FirstName, LastName, Role, TelephoneNumber, Email, Login, Password, PasswordConfirm } = userRegister;

    const handleChangeUserRegister = (event) => {
        const updatedDatum = { [event.target.dataset.role]: event.target.value };
        handleStateFunctional(updatedDatum, "userRegister");

    };

    return (
        <div className="row">
            <form>
                <div className="row">
                    <div className="input-field col s6">
                        <input type="text" value={FirstName} data-role="FirstName" onChange={handleChangeUserRegister} id="icon_prefix" className="validate" />
                        <label className="active" htmlFor="icon_prefix">First Name</label>
                    </div>
                    <div className="input-field col s6">
                        <input type="text" value={LastName} data-role="LastName" onChange={handleChangeUserRegister} id="last_name" className="validate" />
                        <label className="active" htmlFor="last_name">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input value={Email} data-role="Email" onChange={handleChangeUserRegister} id="email" type="email" className="validate" />
                        <label className="active" htmlFor="email">Email</label>
                    </div>
                    <div className="input-field col s6">
                        <input value={TelephoneNumber}
                            data-role="TelephoneNumber"
                            onChange={handleChangeUserRegister}
                            id="TelephoneNumber"
                            className="validate"
                            type="tel"
                            pattern="^\+\d{3}\s*.\d{2}.\s*[0-9]{3}.[0-9]{2}.[0-9]{2}$"
                            placeholder={"+375 (12) 123-45-67"}
                            required
                        />
                        <label className="active" htmlFor="TelephoneNumber">Telephone Number</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s8">
                        <input value={Login} data-role="Login" onChange={handleChangeUserRegister} id="login" type="text" className="validate" />
                        <label className="active" htmlFor="login">Login</label>
                    </div>
                    <div className="input-field col s4">
                        <select defaultValue={Role} data-role="Role" onChange={handleChangeUserRegister} id="role" className="browser-default">
                            <option value="guest" >{"guest"}</option>
                            <option value="admin" >{"admin"}</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input value={Password} data-role="Password" onChange={handleChangeUserRegister} id="password" type="password" className="validate" />
                        <label className="active" htmlFor="password">Password</label>
                    </div>
                    <div className="input-field col s6">
                        <input value={PasswordConfirm} data-role="PasswordConfirm" onChange={handleChangeUserRegister} id="passwordConfirm" type="password" className="validate" />
                        <label className="active" htmlFor="passwordConfirm">Password Confirm</label>
                    </div>
                </div>
                <div className="row">
                    <ErrorResult errorUser={errorUser} />
                </div>
                <div className="row">
                    <div className="col s6">
                        <button data-role="Reset" onClick={onResetClick} type="reset" className="btn" >Reset<i className="material-icons right">reset</i></button>
                    </div>
                    <div className="col s6">
                        <button data-role="Register" onClick={onSignUpRegister} type="button" className="btn" >register<i className="material-icons right">send</i></button>
                    </div>
                </div>
            </form>
        </div>
    );
};

RegisterForm.propTypes = {
    errorUser: PropTypes.array,
    userRegister: PropTypes.object,
    handleStateFunctional: PropTypes.func,
    onResetClick: PropTypes.func,
    onSignUpRegister: PropTypes.func,
};

export default RegisterForm;