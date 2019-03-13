
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class Login extends Component {
    static propTypes = {

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
            const response = await fetch(urlControlActionAccountLogin, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "Login": Login, "Password": Password }),
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
                    <form className="col s12">
                        <div className="input-field col s6">
                            <input className="validate" type="text" data-role="Login" id="Login" placeholder="Placeholder" value={this.state.Login} onChange={this.handleChange} />
                            <label htmlFor="Login">Введите Email</label>
                        </div>
                        <div className="input-field col s6">
                            <input className="validate" type="Password" data-role="Password" id="Password" value={this.state.Password} onChange={this.handleChange} />
                            <label htmlFor="Password">Введите пароль</label>
                        </div>
                        <div className="input-field col s6">
                            <button type="button" className="btn" onClick={(e) => this.getDataTable(e)}>Войти</button>
                        </div>
                    </form>
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
