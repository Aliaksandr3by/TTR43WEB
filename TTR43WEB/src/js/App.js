import PropTypes from "prop-types";
import React, { Component } from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import M from "materialize-css";

import Navigate from "./Navigate/Navigate";
import Authenticate from "./Account/Authenticate";
import CoastTextareaUrl from "./Coast/CoastTextareaUrl";
import MainTable from "./MainPage/MainTable";
import ProgressPage from "./Coast/ProgressPage";



/**
 * Главный компонент
 * @componentName Main class
 * @description Главный компонент
 */
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
            favorite: [],
            favoriteSelect: false,
            filter: this.getItemLocalStorage("filter"),
            pageSize: Number(window.localStorage.getItem("pageSize")) || 10,
            productPage: Number(window.localStorage.getItem("productPage")) || 0,
            totalItems: 0,
            totalPages: 0,
        };

        (async () => {

        })();
    }

    getItemLocalStorage = (name = "") => window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : [];

    //взывается сразу же после отображения компонента на экране приведут к запуску жизненного цикла обновления и к повторному отображению компонента на экране
    async componentDidMount() {
        M.FormSelect.init(document.querySelectorAll("select"), {});
        M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

        await this.getAllProductsFavorite();
        await this.handlePageOptions(this.state);
    }

    //непосредственно перед удалением его с экрана 
    async componentWillUnmount() {
        await this.getAllProductsFavorite();
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

    /**
     *Метод получает перечень избранных товаров авторизованного пользователя
     *
     * @memberof App
     */
    getAllProductsFavorite = async () => {
        if (this.state.AspNetCoreCookies) {
            try {
                const response = await fetch(`${this.props.urlControlAction.urlControlActionGetAllProductsFavorite}`, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow", // manual, *follow, error
                    referrer: "no-referrer", // no-referrer, *client
                });

                const result = await response.json();

                this.setState({
                    "favorite": result
                });

                return result;

            } catch (error) {
                console.error(error);
            }
        }
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

    /**
     * Обновляет поле состояния
     *
     * @memberof App
     * @param object объект добавляемый в состояние
     */
    handleStateResultObject = async (object) => {
        await this.setState((state, props) => {
            return { ...state, ...object };
        });
        //console.log(this.state);
    }

    /**
     * Заменяет поле состояния полностью
     *
     * @memberof App
     */
    handleStateProperty = (property, name) => {
        this.setState((state, props) => {
            return { [name]: property };
        });
    }

    render() {

        const { AspNetCoreCookies = "", user = {}, favoriteSelect } = this.state;
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
                        getAllProductsFavorite={this.getAllProductsFavorite}
                        cookies={this.props.cookies}
                        user={user}
                    />
                </header>
                <main className="row" id="main" role="main">
                    <CoastTextareaUrl
                        urlControlAction={urlControlAction}
                        handleStateResultObject={this.handleStateResultObject}
                        stateChangeResult={this.stateChangeResult}
                        AspNetCoreCookies={AspNetCoreCookies}
                        state={this.state}
                        handleStateProperty={this.handleStateProperty}
                    />
                    <MainTable
                        state={this.state}
                        props={this.props}
                        handleStateResultObject={this.handleStateResultObject}
                        stateChangeResult={this.stateChangeResult}
                        handlePageOptions={this.handlePageOptions}
                        getAllProductsFavorite={this.getAllProductsFavorite}
                        handleStateProperty={this.handleStateProperty}
                    />
                </main>
                <footer className="row" id="footer" role="status">
                    <ProgressPage />
                </footer>
            </React.Fragment>
        );
    }
}

export default withCookies(App);



