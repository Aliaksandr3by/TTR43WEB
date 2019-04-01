
import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { Cookies } from "react-cookie";
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
            userRegister: window.localStorage.getItem("userRegister")
                ? JSON.parse(window.localStorage.getItem("userRegister"))
                : { "FirstName": "", "LastName": "", "Role": "guest", "TelephoneNumber": "", "Email": "", "Login": "", "Password": "", "PasswordConfirm": "" },
        };
        this.handleChange = this.handleChange.bind(this);
        this.urlControlAction = this.props.urlControlAction;
        this.handleStateResultObject = this.props.handleStateResultObject;
    }

    async componentDidMount() {

    }

    async componentDidUpdate() {
        M.Collapsible.init(document.querySelectorAll(".collapsible"), {});
    }

    register = async () => {
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
            const regObject = this.state.userRegister;
            for (const key in regObject) {
                if (regObject.hasOwnProperty(key)) {
                    userData.append(key, regObject[key]);
                }
            }

            const response = await fetch(this.urlControlAction.urlControlActionAccountRegister, {
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
            const { errorUserRegister, count } = json;
            if (!errorUserRegister && count > 0) {

                try {
                    const { user: { dateTimeRegistration, email, firstName, guid, lastName, login, password, passwordConfirm, role, telephoneNumber } = {} } = json;
                    const coreCookies = { "AspNetCoreCookies": this.props.cookies.get(".AspNetCore.Cookies") || false };
                    const result = { ...json, ...coreCookies };
                    this.handleStateResultObject(result);
                    window.localStorage.setItem("Login", login);
                } catch (error) {
                    console.error(error);
                }

            } else {
                this.setState(json);
            }

        } catch (error) {
            this.setState({
                error
            });
        }
    };

    login = async () => {
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
            const { errorUserLogin } = json;
            if (!errorUserLogin) {
                const coreCookies = { "AspNetCoreCookies": this.props.cookies.get(".AspNetCore.Cookies") || false };
                const result = { ...json, ...coreCookies };
                this.handleStateResultObject(result);
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
            const response = await fetch(this.urlControlAction.urlControlActionAccountLogout, { method: "POST" });
            if (await response.json()) {
                const coreCookies = this.props.cookies.get(".AspNetCore.Cookies") || "";
                this.handleStateResultObject({ "AspNetCoreCookies": coreCookies });
            }
        } catch (error) {
            this.setState({
                error
            });
        }
    };

    handleChange(event) {
        this.setState({ [event.target.dataset.role]: event.target.value });
    }

    handleChangeRegister(event) { //хеш пароля
        const tmp = { ...this.state.userRegister, ...{ [event.target.dataset.role]: event.target.value } };
        window.localStorage.setItem("userRegister", JSON.stringify(tmp));
        this.setState((state, props) => {
            return { "userRegister": tmp };
        });
    }

    telephoneNumberModificatory = (telephoneNumber) => {
        const _t = [..."00000000000"];
        const daf = [...telephoneNumber];
        for (let i = 0; i < 13; i++) {
            _t[i] = daf[i] || 0;
        }
        console.log(_t);
        //_t.length = 11;
        const qwe = `+ ${_t[0]}${_t[1]}${_t[2]} - ${_t[3]}${_t[4]} - ${_t[5]}${_t[6]}${_t[7]} - ${_t[8]}${_t[9]} - ${_t[10]}${_t[11]}`;
        return telephoneNumber;
    }

    handleStateFunctional = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
    }

    async onResetClick(e) {
        const items = Object.entries({ ...this.state.userRegister }).map(([el, val], i) => {
            return [el, ""];
        });
        await this.handleStateFunctional({ userRegister: Object.fromEntries(items) });
        window.localStorage.removeItem("userRegister");
    }

    loginForm = (errorUser) => {
        return (
            <div className="row">
                <form>
                    <div className="input-field ">
                        <input className="validate" type="text" data-role="Login" id="Login" value={this.state.Login} onChange={this.handleChange} />
                        <label htmlFor="Login">Введите Email/Login/Phone</label>
                    </div>
                    <div className="input-field ">
                        <input className="validate" type="Password" data-role="Password" id="Password" value={this.state.Password} onChange={this.handleChange} />
                        <label htmlFor="Password">Введите пароль</label>
                    </div>
                    <div className="input-field ">
                        <button type="button" className="btn" onClick={(e) => this.login(e)}>Войти</button>
                    </div>
                    {
                        this.errorResult(errorUser)
                    }
                </form>
            </div>
        );
    }

    registerForm = (errorUser) => {
        const { FirstName, LastName, Role, TelephoneNumber, Email, Login, Password, PasswordConfirm } = this.state.userRegister;
        return (
            <div className="row">
                <form>
                    <div className="row">
                        <div className="input-field col s6">
                            <input type="text" value={FirstName} data-role="FirstName" onChange={this.handleChangeRegister.bind(this)} id="icon_prefix" className="validate" />
                            <label className="active" htmlFor="icon_prefix">First Name</label>
                        </div>
                        <div className="input-field col s6">
                            <input type="text" value={LastName} data-role="LastName" onChange={this.handleChangeRegister.bind(this)} id="last_name" className="validate" />
                            <label className="active" htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={Email} data-role="Email" onChange={this.handleChangeRegister.bind(this)} id="email" type="email" className="validate" />
                            <label className="active" htmlFor="email">Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={this.telephoneNumberModificatory(TelephoneNumber)} data-role="TelephoneNumber" onChange={this.handleChangeRegister.bind(this)} id="TelephoneNumber" type="tel" className="validate" />
                            <label className="active" htmlFor="TelephoneNumber">Telephone Number</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s8">
                            <input value={Login} data-role="Login" onChange={this.handleChangeRegister.bind(this)} id="login" type="text" className="validate" />
                            <label className="active" htmlFor="login">Login</label>
                        </div>
                        <div className="input-field col s4">
                            <select value={Role} data-role="Role" onChange={this.handleChangeRegister.bind(this)} id="role" className="browser-default">
                                <option value="guest" >{"guest"}</option>
                                <option value="admin" >{"admin"}</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={Password} data-role="Password" onChange={this.handleChangeRegister.bind(this)} id="password" type="password" className="validate" />
                            <label className="active" htmlFor="password">Password</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={PasswordConfirm} data-role="PasswordConfirm" onChange={this.handleChangeRegister.bind(this)} id="passwordConfirm" type="password" className="validate" />
                            <label className="active" htmlFor="passwordConfirm">Password Confirm</label>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.errorResult(errorUser)
                        }
                    </div>
                    <div className="row">
                        <div className="col s6">
                            <button data-role="Reset" onClick={this.onResetClick.bind(this)} type="reset" className="btn" >Reset<i className="material-icons right">reset</i></button>
                        </div>
                        <div className="col s6">
                            <button data-role="Register" onClick={this.register.bind(this)} type="button" className="btn" >register<i className="material-icons right">send</i></button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    errorResult = (errorUser = "") => {
        return (<ul>
            {
                errorUser
                    ? errorUser.map((e, i) => {
                        return (<li data-error={"login error"} key={i}>{`${i} - ${e}`}</li>);
                    })
                    : (<li></li>)
            }
        </ul>);
    }

    render() {
        const { AspNetCoreCookies, user: { login } = {} } = this.props;
        const { error = null, errorUserLogin = [], errorUserRegister = [] } = this.state;
        if (AspNetCoreCookies) {
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
                                {this.loginForm(errorUserLogin)}
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header"><i className="material-icons">filter_drama</i>Register</div>
                            <div className="collapsible-body">
                                {this.registerForm(errorUserRegister)}
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
    }
}

export default Authenticate;