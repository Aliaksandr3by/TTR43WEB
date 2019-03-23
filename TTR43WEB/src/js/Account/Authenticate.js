
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
        Login: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            Login: window.localStorage.getItem("Login") || "",
            Password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.urlControlAction = this.props.urlControlAction;
        this.handleStateResultObject = this.props.handleStateResultObject;
    }

    async componentDidMount() {
        // this.handleStateResultObject({
        //     AspNetCoreCookies: this.props.cookies.get(".AspNetCore.Cookies"),
        // });
    }

    async componentDidUpdate() {

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
            window.localStorage.setItem("Login", json.login);
            this.handleStateResultObject({ ...json, ...{ AspNetCoreCookies: this.props.cookies.get(".AspNetCore.Cookies") } });
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

    render() {
        const { AspNetCoreCookies, Login } = this.props;
        if (AspNetCoreCookies) { // [|| 6][&& 7]
            return (
                <div className="row">
                    <div className="col s10" >
                        <p>{Login}</p>
                    </div>
                    <div className="input-field col s2">
                        <button type="button" className="btn" onClick={(e) => this.logOut(e)}>Выйти</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="row">
                    <div className="col s12" >
                        <div className="input-field col s5">
                            <input className="validate" type="text" data-role="Login" id="Login" placeholder="Placeholder" value={this.state.Login} onChange={this.handleChange} />
                            <label htmlFor="Login">Введите Email</label>
                        </div>
                        <div className="input-field col s5">
                            <input className="validate" type="Password" data-role="Password" id="Password" value={this.state.Password} onChange={this.handleChange} />
                            <label htmlFor="Password">Введите пароль</label>
                        </div>
                        <div className="input-field col s2">
                            <button type="button" className="btn" onClick={(e) => this.login(e)}>Войти</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Authenticate;