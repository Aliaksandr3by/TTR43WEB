import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import ProductInfo from "./Coast/ProductInfo";
import { Navigate } from "./Coast/Navigate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";

import Login from "./Account/Login";
import ProgressPage from "./Coast/ProgressPage";

class App extends Component {
    static propTypes = {
        __RequestVerificationToken: PropTypes.string,
        urlControlAction: PropTypes.object.isRequired,
    };

    //является первой функцией, вызываемой при установке компонента
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            __RequestVerificationToken: "",
            progressAllPage: 0,
        };
        this.urlControlAction = this.props.urlControlAction;
        
    }

    //взывается сразу же после отображения компонента на экране приведут к запуску жизненного цикла обновления и к повторному отображению компонента на экране
    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
        M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
        console.log("componentDidMount");
        try {
            const response = await fetch(this.urlControlAction.urlControlActionAccountLogin);
            const json = await response.json();
            console.log(json);
            this.setState(json);
        } catch (error) {
            this.setState({
                error
            });
            console.error(error);
        }
    }
    //непосредственно перед удалением его с экрана 
    async componentWillUnmount() {

    }

    //предикат, способный отменить обновление;
    async shouldComponentUpdate(nextProps, nextState) {
        
    }
    //вызывается сразу же после выполнения обновления, после вызова метода отображения render ;
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
        const { __RequestVerificationToken } = this.props;
        return (
            <div>
                <header className="row" role="navigation">
                    <Navigate />
                    <Login
                        urlControlAction={this.urlControlAction}
                        __RequestVerificationToken={__RequestVerificationToken} />
                </header>
                <main className="row" id="main" role="main">
                    <CoastTextareaUrl
                        stateChangeResult={this.stateChangeResult}
                        urlControlAction={this.urlControlAction}
                    />
                    <ProductInfo
                        urlControlAction={this.urlControlAction}
                        name="table"
                        products={products} />
                </main>
                <footer className="row" id="footer" role="status">
                    <ProgressPage/>
                </footer>
            </div>
        );
    }
}

export default App;