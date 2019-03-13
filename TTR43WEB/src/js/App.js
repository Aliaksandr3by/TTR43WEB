import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import ProductInfo from "./Coast/ProductInfo";
import { Navigate } from "./Coast/Navigate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";

import Login from "./Account/Login";

class App extends Component {
    static propTypes = {

    };

    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }

    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
    }
    async componentDidUpdate() {

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
        return (
            <React.Fragment>
                <header className="row" role="navigation">
                    <Navigate />
                    <Login />
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