
import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import M from "materialize-css";

class Authenticate extends Component {
    static propTypes = {
        urlControlAction: PropTypes.object.isRequired,
        handleStateResultObject: PropTypes.func.isRequired,
        cookies: instanceOf(Cookies).isRequired,
        AspNetCoreCookies: PropTypes.string,
        user: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorUser: [],
            Login: "",
            Password: "",
            userRegister: JSON.parse(window.localStorage.getItem("userRegister")),
        };
        this.handleChange = this.handleChange.bind(this);
        this.urlControlAction = this.props.urlControlAction;
        this.handleStateResultObject = this.props.handleStateResultObject;
        const userRegister = JSON.parse(window.localStorage.getItem("userRegister"));
        console.log(this.state);
    }

    async componentDidMount() {

    }

    async componentDidUpdate() {
        const elems = document.querySelectorAll(".collapsible");
        const instances = M.Collapsible.init(elems, {});
    }

    login = async (e) => {
        try {
            const { Login, Password } = this.state;
            ///Костыль
            var VerificationToken = document.createElement("div");
            const tmp = await fetch(this.urlControlAction.urlControlActionGETAccountRequestVerificationToken);
            VerificationToken.innerHTML = await tmp.text();
            const __RequestVerificationToken = VerificationToken.querySelector("input[name=__RequestVerificationToken]").value;
            ///----------------

            const userData = new FormData();
            userData.append("__RequestVerificationToken", __RequestVerificationToken);
            userData.append("Login", Login);
            userData.append("Password", Password);

            const response = await fetch(this.urlControlAction.urlControlActionAccountLogin, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Accept": "application/json, application/xml, text/plain, text/html, *.*",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: userData, // body data type must match "Content-Type" header
            });
            const json = await response.json();
            const { errorUser } = json;
            if (!errorUser) {
                this.handleStateResultObject({ ...json, ...{ AspNetCoreCookies: this.props.cookies.get(".AspNetCore.Cookies") } });
                window.localStorage.setItem("Login", Login);
            } else {
                this.setState(json);
            }

        } catch (error) {
            this.setState({
                error
            });
        }
    };

    logOut = async () => {
        try {
            await fetch(this.urlControlAction.urlControlActionAccountLogout, { method: "POST" });
            this.handleStateResultObject({ AspNetCoreCookies: this.props.cookies.get(".AspNetCore.Cookies") });
        } catch (error) {
            this.setState({
                error
            });
        }
    };

    handleChange(event) {
        this.setState({ [event.target.dataset.role]: event.target.value });
    }

    handleChangeRegister(event) {
        const tmp = { ...this.state.userRegister, ...{ [event.target.dataset.role]: event.target.value } };
        this.setState((state, props) => {
            return { "userRegister":  tmp};
        });
        window.localStorage.setItem("userRegister", JSON.stringify(tmp));
    }

    errorResult = (error = "") => {
        return error ? <ul>{error.map((e, i) => <li key={i}>{`${i}: ${e}`}</li>)}</ul> : <p>{}</p>;
    };

    loginForm = (errorUser) => {
        return (
            <div className="row">
                <div className="input-field ">
                    <input className="validate" type="text" data-role="Login" id="Login" value={this.state.Login} onChange={this.handleChange} />
                    <label htmlFor="Login">Введите Email</label>
                </div>
                <div className="input-field ">
                    <input className="validate" type="Password" data-role="Password" id="Password" value={this.state.Password} onChange={this.handleChange} />
                    <label htmlFor="Password">Введите пароль</label>
                </div>
                <div className="input-field ">
                    <button type="button" className="btn" onClick={(e) => this.login(e)}>Войти</button>
                </div>
                <div>
                    {this.errorResult(errorUser)}
                </div>
            </div>
        );
    }
    userRegister
    registerForm = (errorUser = []) => {
        return (
            <div className="row">
                <div className="row">
                    <div className="input-field col s6">
                        <input type="text" value={this.state.userRegister.FirstName} data-role="FirstName" onChange={this.handleChangeRegister.bind(this)} id="icon_prefix" className="validate" />
                        <label className="active" htmlFor="icon_prefix">First Name</label>
                    </div>
                    <div className="input-field col s6">
                        <input type="text" value={this.state.userRegister.LastName} data-role="LastName" onChange={this.handleChangeRegister.bind(this)} id="last_name" className="validate" />
                        <label className="active" htmlFor="last_name">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input data-role="Email" onChange={this.handleChangeRegister.bind(this)} id="email" type="email" className="validate" />
                        <label className="active" htmlFor="email">Email</label>
                    </div>
                    <div className="input-field col s6">
                        <input data-role="TelephoneNumber" onChange={this.handleChangeRegister.bind(this)} id="TelephoneNumber" type="tel" className="validate" />
                        <label className="active" htmlFor="TelephoneNumber">Telephone</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s8">
                        <input data-role="Login" onChange={this.handleChangeRegister.bind(this)} id="login" type="text" className="validate" />
                        <label className="active" htmlFor="login">Login</label>
                    </div>
                    <div className="input-field col s4">
                        <select id="role" className="browser-default">
                            <option defaultValue="1" >{"guest"}</option>
                            <option defaultValue="2" >{"admin"}</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input data-role="Password" onChange={this.handleChangeRegister.bind(this)} id="password" type="password" className="validate" />
                        <label className="active" htmlFor="password">Password</label>
                    </div>
                    <div className="input-field col s6">
                        <input data-role="PasswordConfirm" onChange={this.handleChangeRegister.bind(this)} id="passwordConfirm" type="password" className="validate" />
                        <label className="active" htmlFor="passwordConfirm">Password Confirm</label>
                    </div>
                </div>
                <div>
                    <ul>
                        {errorUser.map((e, i) => <li key={i}>{`${i}: ${e}`}</li>)}
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        const { AspNetCoreCookies, user: { login } = {} } = this.props;
        const { error = null, errorUser = [] } = this.state;
        if (AspNetCoreCookies) { // [|| 6][&& 7]
            return (
                <div className="row">
                    <div className="col s10" >
                        <p>{login}</p>
                    </div>
                    <div className="input-field col s2">
                        <button type="button" className="btn" onClick={(e) => this.logOut(e)}>Выйти</button>
                    </div>
                </div>
            );
        } else if (error) {
            return (
                <React.Fragment>
                    <div>Error: {error.message}</div>
                </React.Fragment>
            );
        } else {
            return (
                <div className="row">
                    <ul className="collapsible">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Login</div>
                            <div className="collapsible-body">
                                {this.loginForm(errorUser)}
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Register</div>
                            <div className="collapsible-body">
                                {this.registerForm(errorUser)}
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
    }
}

export default Authenticate;