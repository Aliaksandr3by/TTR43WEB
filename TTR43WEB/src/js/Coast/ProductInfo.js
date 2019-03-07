import PropTypes from "prop-types";
import React, { Component } from "react";
import CreateSelect from "./Select";

class ProductInfo extends Component {
    static propTypes = {
    };
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            pageSize: 10,
            productPage: 1,
        };
        this.onSelect = this.onSelect.bind(this);
    }
    componentDidMount() {
        const data = {
            "pageSize": this.state.pageSize,
            "productPage": this.state.productPage
        };
        const init = {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        };
        fetch(urlControlActionGetTable, init)
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    this.setState(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                    console.error(error);
                }
            );
    }
    handleStateResultObject = (object) => {
        this.setState((state, props) => {
            return Object.assign(state, object);
        });
    }
    onSelect(event) {
        this.handleStateResultObject({ currentPage: event.target.value });
    }
    _replacer(item) {
        return item.replace(/([A-Z])/g, " $1").replace(/^./,
            (str) => {
                return str.toUpperCase();
            });
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