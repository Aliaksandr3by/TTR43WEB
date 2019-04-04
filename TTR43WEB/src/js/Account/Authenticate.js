
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
        await this.isAuthenticated();
        //window.addEventListener("keydown", this.loginKey);
    }

    async componentWillUnmount() {
       // window.removeEventListener("keydown", this.loginKey);
    }

    async componentDidUpdate() {
        M.Collapsible.init(document.querySelectorAll(".collapsible"), {});
        window.localStorage.setItem("userRegister", JSON.stringify(this.state.userRegister));
    }

    isAuthenticated = async () => {
        const response = await fetch(this.urlControlAction.urlControlActionAccountLogin);
        const { isAuthenticated } = await response.json();
        window.localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
        return isAuthenticated;
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
            console.error(this.state);
        }
    };

    loginKey = async (e) => {
        //console.log(e.key);
        if (e.key === "Enter") {
            await this.login();
        }
    }

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
                    "Accept": "application/json, text/plain, text/html, *.*",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: userData, // body data type must match "Content-Type" header
            });
            const json = await response.json();
            const { errorUserLogin, user } = json;
            console.warn(user);
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
            console.error(this.state);
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
            console.error(this.state);
        }
    };

    handleChange(event) {
        this.setState({ [event.target.dataset.role]: event.target.value });
    }

    handleChangeUserRegister(event) {
        const updatedDatum = { [event.target.dataset.role]: event.target.value };
        this.setState((state, props) => {
            return { userRegister: { ...state.userRegister, ...updatedDatum } };
        });
    }

    handleStateFunctional = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
    };

    async onResetClick(e) {
        const items = Object.entries({ ...this.state.userRegister }).map(([el, val], i) => {
            return [el, ""];
        });
        await this.handleStateFunctional({ userRegister: Object.fromEntries(items) });
        window.localStorage.removeItem("userRegister");
    }

    loginForm = (errorUser) => {
        return (
            <div className="row" >
                <form>
                    <div className="input-field ">
                        <input className="validate" type="text" data-role="Login" id="Login" value={this.state.Login} onChange={this.handleChange} onKeyDown={this.loginKey.bind(this)}/>
                        <label htmlFor="Login">Введите Email/Login/Phone</label>
                    </div>
                    <div className="input-field ">
                        <input className="validate" type="Password" data-role="Password" id="Password" value={this.state.Password} onChange={this.handleChange} onKeyDown={this.loginKey.bind(this)}/>
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
                            <input type="text" value={FirstName} data-role="FirstName" onChange={this.handleChangeUserRegister.bind(this)} id="icon_prefix" className="validate" />
                            <label className="active" htmlFor="icon_prefix">First Name</label>
                        </div>
                        <div className="input-field col s6">
                            <input type="text" value={LastName} data-role="LastName" onChange={this.handleChangeUserRegister.bind(this)} id="last_name" className="validate" />
                            <label className="active" htmlFor="last_name">Last Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={Email} data-role="Email" onChange={this.handleChangeUserRegister.bind(this)} id="email" type="email" className="validate" />
                            <label className="active" htmlFor="email">Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={TelephoneNumber}
                                data-role="TelephoneNumber"
                                onChange={e => this.handleChangeUserRegister(e)}
                                id="TelephoneNumber"
                                className="validate"
                                type="tel"
                                pattern="^\+\d{3}\s*.\d{2}.\s*[0-9]{3}.[0-9]{2}.[0-9]{2}$"
                                required />
                            <label className="active" htmlFor="TelephoneNumber">Telephone Number</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s8">
                            <input value={Login} data-role="Login" onChange={this.handleChangeUserRegister.bind(this)} id="login" type="text" className="validate" />
                            <label className="active" htmlFor="login">Login</label>
                        </div>
                        <div className="input-field col s4">
                            <select value={Role} data-role="Role" onChange={this.handleChangeUserRegister.bind(this)} id="role" className="browser-default">
                                <option value="guest" >{"guest"}</option>
                                <option value="admin" >{"admin"}</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input value={Password} data-role="Password" onChange={this.handleChangeUserRegister.bind(this)} id="password" type="password" className="validate" />
                            <label className="active" htmlFor="password">Password</label>
                        </div>
                        <div className="input-field col s6">
                            <input value={PasswordConfirm} data-role="PasswordConfirm" onChange={this.handleChangeUserRegister.bind(this)} id="passwordConfirm" type="password" className="validate" />
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

    errorResult = (errorUser = []) => {
        return (<ul>
            {
                errorUser
                    ? errorUser.map((e, i) => <li key={i}>{`${i} ${e}`}</li>)
                    : <li key={0}></li>
            }
        </ul>);
    }
}

export default Authenticate;