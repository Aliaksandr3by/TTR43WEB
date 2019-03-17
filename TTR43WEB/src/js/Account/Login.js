
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class Login extends Component {
    static propTypes = {
        __RequestVerificationToken: PropTypes.string.isRequired,
        urlControlAction: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            Login: "admin",
            Password: "admin",
            isLoaded: false,
            error: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.urlControlAction = this.props.urlControlAction;
    }

    async componentDidMount() {
        //this.setState({"Login": window.localStorage.getItem("Login") || ""});
        this.setState({ isLoaded: true });
    }

    async componentDidUpdate() {
        const { Login } = this.state;
        window.localStorage.setItem("Login", Login);
    }

    getDataTable = async (e) => {
        try {
            const { Login, Password } = this.state;

            const data1 = new FormData();
            data1.append("__RequestVerificationToken", this.props.__RequestVerificationToken);
            data1.append("Login", Login);
            data1.append("Password", Password);

            const data = JSON.stringify({
                "__RequestVerificationToken": this.props.__RequestVerificationToken,
                "Login": Login,
                "Password": Password,
            });

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
                body: data1, // body data type must match "Content-Type" header
            });
            const json = await response.json();
            //this.setState({ textarea: json.description });
            this.setState({
                isLoaded: true,
            });
            console.log(json);
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    };
    handleChange(event) {
        this.setState({ [event.target.dataset.role]: event.target.value });
    }

    render() {
        const { Login, Password, isLoaded, error } = this.state;
        if (isLoaded) {
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
                            <button type="button" className="btn" onClick={(e) => this.getDataTable(e)}>Войти</button>
                        </div>
                        <input name="__RequestVerificationToken" type="hidden"></input>
                    </div>
                </div>
            );
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
