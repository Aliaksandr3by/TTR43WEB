import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";
import Pagination from "./Pagination";

class ProductInfo extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            pageSize: Number(window.localStorage.getItem("pageSize")) || 10,
            productPage: Number(window.localStorage.getItem("productPage")) || 0,
            totalItems: 0,
            totalPages: 0,
            valueDefault: [],
            products: this.props.products,
        };
    }
    _replacer(item) {
        return item.replace(/([A-Z])/g, " $1").replace(/^./,
            (str) => {
                return str.toUpperCase();
            });
    }
    _dateConverter(item) {
        try {
            const dateC = Date.parse(item);
            const dateJS = new Date(dateC);
            const result = dateJS.toLocaleString("RU-be");
            return result;
        } catch (error) {
            return item;
        }
    }
    _moneyConverter(item) {
        try {
            const money = item;
            const result = money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
            return `${result} р.`;
        } catch (error) {
            return item;
        }
    }
    async getDataTable({ pageSize, productPage }) {
        try {
            // const response = await fetch(urlControlActionGetTable, {
            //     method: "POST", // *GET, POST, PUT, DELETE, etc.
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         "pageSize": pageSize,
            //         "productPage": productPage,
            //     }),
            // });
            const response = await fetch(`Gipermall/GetItemProduct/Page${productPage}/Size${pageSize}`, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
            });
            const json = await response.json();
            window.localStorage.setItem("productPage", json.productPage);
            window.localStorage.setItem("pageSize", json.productPage);
            return json;
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    }
    async componentDidMount() {
        const tmp = await this.getDataTable(this.state);
        this.setState(tmp);
    }
    async dataUpdate(e) {
        try {
            const response = await fetch(urlControlActionGetCoastAsync, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "idGoods": e.target.getAttribute("data-update-url"),
                }),
            });
            const json = await response.json();
            if (json.description.id !== 0) {
                M.toast(
                    {
                        html: `${json.description.id} - ${json.description.name} добавлен в базу данных`,
                        classes: "rounded"
                    }
                );
                console.log(json.description.name);
            }
            console.log(json.description);
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    }
    handleStateResultObject = async (object) => {
        this.setState((state, props) => {
            return Object.assign(state, object);
        });
        const tmp = await this.getDataTable(object);
        this.setState(tmp);
    }
    render() {
        const { error, isLoaded, items } = this.state;
        if (this.state.isLoaded && items.length !== 0) {
            return (
                <React.Fragment>
                    <table className="col s12 striped highlight" data-src={this.props.name}>
                        <caption><p>{this.props.name}</p></caption>
                        <thead>
                            <tr>
                                {
                                    Object.keys(items[0]).map((el, i) => {
                                        if (el.toLowerCase() === "url") {
                                            return (<th key={i} >
                                                UPDATE
                                            </th>);
                                        } else {
                                            return (<th key={i} >
                                                {this._replacer(el)}
                                            </th>);
                                        }
                                    }
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.from(items).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            {
                                                Object.keys(item).map((el, i) => {
                                                    if (el.toLowerCase() === "id") {
                                                        return (<th key={i} name={`ID${item.id}`}>
                                                            <a href="#!">{item[el]}</a>
                                                        </th>);
                                                    } else if (el.toLowerCase() === "name") {
                                                        return (<td key={i}>
                                                            <a href={item["url"]}>{item[el]}</a>
                                                        </td>);
                                                    } else if (el.toLowerCase() === "date") {
                                                        return (<td key={i}>
                                                            {this._dateConverter(item[el])}
                                                        </td>);
                                                    } else if (el.toLowerCase() === "price") {
                                                        return (<td key={i} title={item[el]}>
                                                            {this._moneyConverter(item[el])}
                                                        </td>);
                                                    } else if (el.toLowerCase() === "pricewithoutdiscount") {
                                                        return (<td key={i} title={item[el]}>
                                                            {this._moneyConverter(item[el])}
                                                        </td>);
                                                    } else if (el.toLowerCase() === "url") {
                                                        return (<td key={i} >
                                                            <a
                                                                className="btn-floating btn-small waves-effect waves-light red"                                                            >
                                                                <i className="material-icons"
                                                                    onClick={e => this.dataUpdate(e)}
                                                                    data-update-url={item[el]}>update</i>
                                                            </a>
                                                        </td>);
                                                    } else {
                                                        return (<td key={i}>
                                                            {item[el]}
                                                        </td>);
                                                    }
                                                })
                                            }
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <Pagination
                        state={this.state}
                        handleStateResultObject={this.handleStateResultObject}
                    />,
                </React.Fragment>
            );
        } else if (items.length === 0) {
            return (
                <React.Fragment>
                    <div>Error: {items.length}</div>
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
}
export default ProductInfo;