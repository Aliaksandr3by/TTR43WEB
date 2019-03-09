import PropTypes from "prop-types";
import React, { Component } from "react";
import { PageSizeSelector } from "./PageSize";
import { PageList } from "./PageList";

class Pagination extends Component {
    static propTypes = {
    };
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            error: null,
            isLoaded: false,
            valueDefault: this.props.state.valueDefault,
            pageSize: this.props.state.pageSize,
            totalPages: this.props.state.totalPages,
            productPage: this.props.state.productPage,
        };
        this.onSelect = this.onSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.selectElement;
    }

    async getDataPagination(pageSize) {
        try {
            const response = await fetch(urlControlActionPagination, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "pageSize": pageSize
                }),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    }
    async componentDidMount() {
        const result = await this.getDataPagination(this.state.pageSize);
        this.setState({
            isLoaded: true,
            items: this.createPaging(result),
            valueDefault: result.valueDefault,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
        });
    }
    async componentDidUpdate() {
        console.log(this.selectElement);
    }
    createPaging({ totalPages, pageSize }) {
        const href = (i, s) => `#/Page${i + 1}/Size${s}`;
        let li = [];
        for (let i = 0; i < totalPages; i++) {
            li[i] = {
                href: href(i, pageSize),
                data: i + 1
            };
        }
        li.unshift({
            href: ``,
            data: <i className="material-icons">chevron_left</i>
        });
        li.push({
            href: ``,
            data: <i className="material-icons">chevron_right</i>
        });
        return li;
    }

    async onChange(event) { //селектор размера страниц
        const pageSize = Number(event.target.value);
        const productPage = Number(this.state.productPage);

        window.localStorage.setItem("pageSize", pageSize);
        this.setState({ pageSize: pageSize });
        const tmp = await this.getDataPagination(pageSize);
        const items = this.createPaging(tmp);
        this.setState({
            items: items,
        });
        this.props.handleStateResultObject({
            pageSize: pageSize,
            productPage: productPage,
        });
    }
    onSelect(event) { //номер страницы
        const productPage = Number(event.target.textContent);
        const pageSize = Number(this.state.pageSize);

        window.localStorage.setItem("productPage", productPage);
        this.setState({ productPage: productPage });
        this.props.handleStateResultObject({
            pageSize: pageSize,
            productPage: productPage,
        });
        //event.preventDefault();
    }
    render() {
        const { error, isLoaded, items, valueDefault } = this.state;
        if (this.state.isLoaded) {
            return (
                <React.Fragment>
                    <PageSizeSelector
                        valueDefault={this.state.valueDefault}
                        pageSize={Number(this.state.pageSize)}
                        selectRef={el => this.selectElement = el}
                        onChange={this.onChange}
                    />
                    <PageList
                        items={this.state.items}
                        productPage={Number(this.state.productPage)}
                        pageSize={Number(this.state.pageSize)}
                        onSelect={this.onSelect}
                    />
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
export default Pagination;