import PropTypes from "prop-types";
import React, { Component } from "react";
import Pagination from "./Pagination";

class ProductInfo extends Component {
    static propTypes = {
    };
    _replacer(item) {
        return item.replace(/([A-Z])/g, " $1").replace(/^./,
            (str) => {
                return str.toUpperCase();
            });
    }
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            pageSize: window.localStorage.getItem("pageSize") || 10,
            productPage: window.localStorage.getItem("productPage") || 1,
        };
    }
    async getDataTable({ pageSize, productPage }) {
        try {
            const response = await fetch(urlControlActionGetTable, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "pageSize": pageSize,
                    "productPage": productPage,
                }),
            });
            const json = await response.json();
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
                    <table className="striped highlight" data-src={this.props.name}>
                        <caption><p>{this.props.name}</p></caption>
                        <thead>
                            <tr>
                                {
                                    Object.keys(items[0]).map((item, i) => {
                                        return (<th key={i}>
                                            {this._replacer(item)}
                                        </th>);
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
                                                        return (<th key={i}>
                                                            {item[el]}
                                                        </th>);
                                                    } else if (el.toLowerCase() === "name") {
                                                        return (<td key={i}>
                                                            <a href={item["url"]}>{item[el]}</a>
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