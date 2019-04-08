
import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { Cookies } from "react-cookie";
import M from "materialize-css";

import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";

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
            status: "ok",
            error: null,
            Login: "",
            Password: "",
            userRegister: window.localStorage.getItem("userRegister")
                ? JSON.parse(window.localStorage.getItem("userRegister"))
                : { "FirstName": "", "LastName": "", "Role": "guest", "TelephoneNumber": "", "Email": "", "Login": "", "Password": "", "PasswordConfirm": "" },
        };
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

    onSignUpRegister = async () => {
        try {
            ///Костыль
            const VerificationToken = document.createElement("div");
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

    onSignInKeyEnter = async (e) => {
        //console.log(e.key);
        if (e.key === "Enter") {
            await this.onSignIn();
        }
    }

    onSignIn = async () => {
        try {
            const { Login, Password } = this.state;
            ///Костыль
            const VerificationToken = document.createElement("div");
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
            if (!errorUserLogin) {
                console.warn(user);
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

    onLogOut = async () => {
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

    handleChange(object) {
        this.setState((state, props) => {
            return object;
        });
        //console.log(this);
    }

    handleStateFunctional = async (object, name) => {
        await this.setState((state, props) => {
            const tmp = { ...state[name] };
            const tmp2 = { ...object };
            const tmp3 = { ...tmp, ...tmp2 };
            return { [name]: tmp3 };
        });
        //console.dir(this.state);
    };

    async onResetClick(e) {
        const items = Object.entries({ ...this.state.userRegister }).map(([el, val], i) => {
            return [el, ""];
        });
        await this.handleState({ userRegister: Object.fromEntries(items) });
        window.localStorage.removeItem("userRegister");
    }

    handleState = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
    };
    render() {

        const { AspNetCoreCookies, user: { login } = {} } = this.props;
        const { error = null, userRegister, errorUserLogin = [], errorUserRegister = [] } = this.state;

        if (AspNetCoreCookies) {
            return (
                <div className="row">
                    <div className="col s10" >
                        <p>{login}</p>
                    </div>
                    <div className="input-field col s2">
                        <button type="button" className="btn" onClick={(e) => this.onLogOut(e)}>Выйти</button>
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
                            <div className="collapsible-header">
                                <i className="material-icons">filter_drama</i>Login
                            </div>
                            <div className="collapsible-body">
                                <LoginForm
                                    errorUser={errorUserLogin}
                                    userData={this.state}
                                    handleChange={this.handleChange.bind(this)}
                                    onSignIn={this.onSignIn.bind(this)}
                                    onSignInKeyEnter={this.onSignInKeyEnter.bind(this)}
                                />
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header">
                                <i className="material-icons">filter_drama</i>Register
                            </div>
                            <div className="collapsible-body">
                                <RegisterForm
                                    errorUser={errorUserRegister}
                                    userRegister={userRegister}
                                    handleStateFunctional={this.handleStateFunctional.bind(this)}
                                    onResetClick={this.onResetClick.bind(this)}
                                    onSignUpRegister={this.onSignUpRegister.bind(this)}
                                />
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