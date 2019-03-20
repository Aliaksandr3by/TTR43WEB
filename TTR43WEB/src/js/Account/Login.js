
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class Login extends Component {
    static propTypes = {
        urlControlAction: PropTypes.object.isRequired,
        authorize: PropTypes.bool.isRequired,
        handleStateResultObject: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            Login: "",
            Password: "",
            isLoaded: false,
            error: null,
            __RequestVerificationToken: document.querySelector("input[name=__RequestVerificationToken]").value, //document.getElementsByName("__RequestVerificationToken")[0].value
        };
        this.handleChange = this.handleChange.bind(this);
        this.urlControlAction = this.props.urlControlAction;
        this.handleStateResultObject = this.props.handleStateResultObject;
    }

    async componentDidMount() {
        try {
            const response = await fetch(this.urlControlAction.urlControlActionAccountLogin);
            const json = await response.json();
            window.localStorage.setItem("authorize", json.authorize);
            this.setState({
                isLoaded: true,
            });
            this.handleStateResultObject(json);
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    async componentDidUpdate() {

    }

    login = async (e) => {
        try {
            const { Login, Password, __RequestVerificationToken } = this.state;

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
                    //"Content-Type": "application/json",
                    // "Content-Type": "multipart/form-data; boundary",
                    // "Content-Type": "application/x-www-form-urlencoded;",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: userData, // body data type must match "Content-Type" header
            });
            const json = await response.json();
            window.localStorage.setItem("authorize", json.authorize);
            this.setState({
                isLoaded: true,
            });
            this.handleStateResultObject(json);
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    };

    logOut = async () => {
        try {
            const response = await fetch(this.urlControlAction.urlControlActionAccountLogout, { method: "POST" });
            const json = await response.json();
            this.setState({
                isLoaded: true,
            });
            window.localStorage.setItem("authorize", json.authorize);
            this.handleStateResultObject(json);
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    };

    handleChange(event) {
        this.setState({ [event.target.dataset.role]: event.target.value });
    }

    render() {
        const { Login, isLoaded, error, } = this.state;
        const { authorize } = this.props;
        if (isLoaded) {
            if (!authorize) {
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
            } else {
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
            }
        } else if (error) {
            return (
                <React.Fragment>
                    <div>Error: {error.message}</div>
                </React.Fragment>
            );
        } else if (!isLoaded) {
            return (
                <React.Fragment>
                    <div>Loading...</div>
                </React.Fragment>
            );
        }

    }
}

export default Login;