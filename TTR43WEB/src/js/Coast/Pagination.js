import PropTypes from "prop-types";
import React, { Component } from "react";
import { AjaxPOSTAsync } from "../utils.js";
import Select from "./Select";

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResult: {},
            valueDefault: [10, 15, 20, 25, 30, 50, 100],
            pageSize: this.getPageSize(window.localStorage.getItem("pageSize")),
        };
        this.getData(this.state.pageSize);
    }
    getPageSize(tmp) {
        return tmp ? Number(tmp) : 10;
    }
    getData(pageSize) {
        AjaxPOSTAsync(urlControlActionPagination, { "pageSize": pageSize }, "POST")
            .then((datum) => {
                this.handleStateResultObject(datum);
                console.dir(this.state);
            }).catch((error) => {
                console.error(error);
            });
    }
    handleStateResultArray = (array) => {
        this.setState((state, props) => {
            return {
                dataResult: [...state.dataResult, array]
            };
        });
    }
    handleStateResultObject = (object) => {
        this.setState((state, props) => {
            return {
                dataResult: Object.assign(state.dataResult, object),
            };
        });
    }
    handleStatePageSize = (object) => {
        this.setState((state, props) => {
            return Object.assign(state, object);
        });
    }
    creactePaging(el) {
        let totalPages = el.dataResult.totalPages;
        let pageSize = el.pageSize;
        let li = [];
        for (let i = 0; i < totalPages; i++) {
            li[i] = {
                className: "waves-effect",
                href: `/Gipermall/Index/Page${i}/Size${pageSize}`,
                data: i
            };
        }
        li.unshift({
            className: "disabled",
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
    render() {
        return (
            <React.Fragment>
                <Select handleStatePageSize={this.handleStatePageSize} valueArray={this.state.valueDefault} />
                <ul className="pagination">
                    {
                        this.creactePaging(this.state).map((item, i) => {
                            return (<li key={i} className={item.className}><a href={item.href}>{item.data}</a></li>);
                        })
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default Pagination;