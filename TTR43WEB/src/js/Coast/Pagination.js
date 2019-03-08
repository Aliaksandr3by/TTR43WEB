import PropTypes from "prop-types";
import React, { Component } from "react";
import CreateSelect from "./Select";

class Pagination extends Component {
    static propTypes = {
    };
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            error: null,
            isLoaded: false,
            pageSize: window.localStorage.getItem("pageSize") || 10,
            valueDefault: [],
            totalPages: 1,
            currentPage: 1,
            totalItems: 0
        };
        this.onSelect = this.onSelect.bind(this);
    }
    async componentDidMount() {
        const data = {
            "pageSize": this.state.pageSize || 10
        };
        try {
            const response = await fetch(urlControlActionPagination, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            const tmp = this.createPaging(result.totalPages, result.pageSize);
            this.setState({
                isLoaded: true,
                valueDefault: result.valueDefault,
                items: tmp,
                totalPages: result.totalPages,
                totalItems: result.totalItems,
                pageSize: result.pageSize,
            });
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    }
    handleStateResultObject = (object) => {
        this.setState((state, props) => {
            return Object.assign(state, object);
        });
    }
    createPaging(_totalPages, _pageSize) {
        let totalPages = _totalPages;
        let pageSize = _pageSize;
        const href = (i, s) => `/Gipermall/Index/Page${i + 1}/Size${s}`;
        let li = [];
        for (let i = 0; i < totalPages; i++) {
            li[i] = {
                className: "waves-effect",
                href: href(i, pageSize),
                data: i + 1
            };
        }
        li.unshift({
            className: "waves-effect",
            href: ``,
            data: <i className="material-icons">chevron_left</i>
        });
        li.push({
            className: "waves-effect",
            href: ``,
            data: <i className="material-icons">chevron_right</i>
        });
        return li;
    }
    onSelect(event) {
        this.handleStateResultObject({ currentPage: event.target.value });

    }
    render() {
        const { error, isLoaded, items, valueDefault } = this.state;
        if (this.state.isLoaded) {
            return (
                <React.Fragment>
                    <CreateSelect
                        handleStateResultObject={this.handleStateResultObject}
                        createPaging={this.createPaging}
                        pageSize={this.state.pageSize}
                        valueDefault={this.state.valueDefault} />
                    <ul className="pagination">
                        {
                            items.map((item, i) => {
                                return (<li key={i} className={item.className}><a href={item.href} onClick={this.onSelect}>{item.data}</a></li>);
                            })
                        }
                    </ul>
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