import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import ProductInfo from "./Coast/ProductInfo";
import { Navigate } from "./Coast/Navigate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";

import Login from "./Account/Login";

class App extends Component {
    static propTypes = {
        __RequestVerificationToken: PropTypes.string,
    };

    //является первой функцией, вызываемой при установке компонента
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }

    //взывается сразу же после отображения компонента на экране
    //приведут к запуску жизненного цикла обновления и к повторному отображению компонента на экране
    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
        M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
        console.log("componentDidMount");
    }
    //непосредственно перед удалением его с экрана 
    async componentWillUnmount() {
        console.log("componentDidMount");
    }


    async componentDidUpdate() {
        console.log("componentDidMount");
    }

    stateChangeResult = (array, name) => {
        this.setState((state, props) => {
            return {
                [name]: [...state[name], array]
            };
        });
    }

    render() {
        const { products } = this.state;
        const { __RequestVerificationToken } = this.props;
        return (
            <React.Fragment>
                <header className="row" role="navigation">
                    <Navigate />
                    <Login __RequestVerificationToken={__RequestVerificationToken} />
                </header>
                <main className="row" id="main" role="main">
                    <CoastTextareaUrl
                        stateChangeResult={this.stateChangeResult}
                        urlData={urlControlActionGetCoastAsync}
                    />
                    <ProductInfo name="table" products={products} />
                </main>
                <footer className="row" id="footer" role="status"></footer>
            </React.Fragment>
        );
    }
}

export default App;