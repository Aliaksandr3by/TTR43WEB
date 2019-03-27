import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import M from "materialize-css";

import ProductInfo from "./Coast/ProductInfo";
import { Navigate } from "./Coast/Navigate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";

import Authenticate from "./Account/Authenticate";
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
            AspNetCoreCookies: this.props.cookies.get(".AspNetCore.Cookies") || "",
            user: {
                login: window.localStorage.getItem("Login") || "",
            },
            error: null,
            isLoaded: false,
            items: [],
            pageSize: Number(window.localStorage.getItem("pageSize")) || 10,
            productPage: Number(window.localStorage.getItem("productPage")) || 0,
            totalItems: 0,
            totalPages: 0,
        };
        //(async () => await this.handlePageOptions(this.state))();
    }

    //взывается сразу же после отображения компонента на экране приведут к запуску жизненного цикла обновления и к повторному отображению компонента на экране
    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
        M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

        await this.handlePageOptions(this.state);
    }

    //непосредственно перед удалением его с экрана 
    async componentWillUnmount() {

    }
    //предикат, способный отменить обновление;
    async shouldComponentUpdate(nextProps, nextState) {
        //console.log(nextProps);
        //console.log(nextState);
        //return nextState !== this.state;
    }
    //вызывается сразу же после выполнения обновления, после вызова метода отображения render ;
    async componentDidUpdate() {

    }

    handlePageOptions = async ({ pageSize = this.state.pageSize, productPage = this.state.productPage }) => {
        const { urlControlAction = {} } = this.props;
        try {
            const response = await fetch(`${urlControlAction.urlControlActionGETGipermallItemsProduct}/Page${productPage}/Size${pageSize}`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
            });

            const json = await response.json();

            this.handleStateResultObject({
                ...json, ...{ isLoaded: true }
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

    stateChangeResult = async (array, name) => {
        await this.setState((state, props) => {
            if (Array.isArray(array)) {
                return {
                    [name]: [...state[name], ...array]
                };
            } else {
                return {
                    [name]: [...state[name], array]
                };
            }
        });
    }
    
    handleStateResultObject = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
    }
    
    static count = 0;

    countSet = () => {
        return ++App.count;
    }

    renderMainTable({ isLoaded, error, items }) {
        const { urlControlAction = {} } = this.props;
        if (isLoaded && items.length !== 0) {
            return (
                <React.Fragment>
                    <ProductInfo
                        urlControlAction={urlControlAction}
                        state={this.state}
                        handleStateResultObject={this.handleStateResultObject}
                        stateChangeResult={this.stateChangeResult}
                        countSet={this.countSet}
                    />
                    <PageSizeSelector
                        handlePageOptions={this.handlePageOptions}
                        state={this.state}
                    >Число элементов на листе</PageSizeSelector>
                    <PageList
                        handlePageOptions={this.handlePageOptions}
                        state={this.state}
                    ></PageList>
                </React.Fragment>
            );
        } else if (items.length === 0) {
            return (
                <React.Fragment>
                    <div>items: {items.length}</div>
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

        const { AspNetCoreCookies = "", user = {} } = this.state;
        const { urlControlAction = {} } = this.props;

        return (
            <React.Fragment>
                <header className="row" role="navigation">
                    <Navigate
                        urlControlAction={urlControlAction}
                    />
                    <Authenticate
                        urlControlAction={urlControlAction}
                        AspNetCoreCookies={AspNetCoreCookies}
                        handleStateResultObject={this.handleStateResultObject}
                        cookies={this.props.cookies}
                        user={user}
                    />
                </header>
                <main className="row" id="main" role="main">
                    <CoastTextareaUrl
                        urlControlAction={urlControlAction}
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



