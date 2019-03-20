import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import M from "materialize-css";

import ProductInfo from "./Coast/ProductInfo";
import { Navigate } from "./Coast/Navigate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";

import Login from "./Account/Login";
import ProgressPage from "./Coast/ProgressPage";
import PageSizeSelector from "./Coast/PageSizeSelector";
import PageList from "./Coast/PageList";

class App extends Component {
    static propTypes = {
        urlControlAction: PropTypes.object.isRequired,
        cookies: instanceOf(Cookies).isRequired,
    };

    //является первой функцией, вызываемой при установке компонента
    constructor(props) {
        super(props);
        this.state = {
            authorize: JSON.parse(window.localStorage.getItem("authorize") || false),
            error: null,
            isLoaded: false,
            items: [],
            pageSize: Number(window.localStorage.getItem("pageSize")) || 10,
            productPage: Number(window.localStorage.getItem("productPage")) || 0,
            totalItems: 0,
            totalPages: 0,
            valueDefault: [],
            name: "qweqweqwe",
        };
        this.urlControlAction = this.props.urlControlAction;
        console.dir(this.props.cookies);
    }

    //взывается сразу же после отображения компонента на экране приведут к запуску жизненного цикла обновления и к повторному отображению компонента на экране
    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
        M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

        try {
            const AccountLogin = await fetch(this.urlControlAction.urlControlActionAccountLogin);
            const jsonAccountLogin = await AccountLogin.json();
            this.setState({
                ...jsonAccountLogin, ...{ isLoaded: true }
            });
            await this.getDataTable(this.state);
        } catch (error) {
            this.setState({
                error
            });
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

    handleStateResultObject = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
        await this.getDataTable(this.state);
    }

    stateChangeResult = async (array, name) => {
        await this.setState((state, props) => {
            return {
                [name]: [...state[name], array]
            };
        });
    }

    async getDataTable({ pageSize, productPage }) {
        try {
            const response = await fetch(`${this.urlControlAction.urlControlActionGETGipermallItemsProduct}/Page${productPage}/Size${pageSize}`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
            });

            const json = await response.json();

            this.setState({
                ...json
            });

            window.localStorage.setItem("productPage", json.productPage);
            window.localStorage.setItem("pageSize", json.pageSize);

            return json;
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    renderMainTable({ isLoaded, error, authorize, items, name }) {
        if (isLoaded && items.length !== 0 && authorize) {
            return (
                <React.Fragment>
                    <ProductInfo
                        urlControlAction={this.urlControlAction}
                        handleStateResultObject={this.handleStateResultObject}
                        state={this.state}
                    />
                    <PageSizeSelector
                        handleStateResultObject={this.handleStateResultObject}
                        state={this.state}
                    >Число элементов на листе</PageSizeSelector>
                    <PageList
                        handleStateResultObject={this.handleStateResultObject}
                        state={this.state}
                    ></PageList>
                </React.Fragment>
            );
        } else if (items.length === 0) {
            return (
                <React.Fragment>
                    <div>Error: items length = {items.length}</div>
                </React.Fragment>
            );
        } else if (!authorize) {
            return (
                <React.Fragment>
                    <div>authorize Error: {error}</div>
                </React.Fragment>
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

    render() {
        const { authorize } = this.state;

        return (
            <React.Fragment>
                <header className="row" role="navigation">
                    <Navigate
                        urlControlAction={this.urlControlAction}
                    />
                    <Login
                        urlControlAction={this.urlControlAction}
                        authorize={authorize}
                        handleStateResultObject={this.handleStateResultObject}
                    />
                </header>
                <main className="row" id="main" role="main">
                    <CoastTextareaUrl
                        urlControlAction={this.urlControlAction}
                        stateChangeResult={this.stateChangeResult}
                    />
                    {
                        this.renderMainTable(this.state)
                    }
                </main>
                <footer className="row" id="footer" role="status">
                    <ProgressPage />
                </footer>
            </React.Fragment>
        );
    }
}

export default withCookies(App);



