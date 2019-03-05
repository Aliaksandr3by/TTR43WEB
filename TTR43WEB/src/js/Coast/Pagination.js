import PropTypes from "prop-types";
import React, { Component } from "react";
import { AjaxPOSTAsync } from "../utils.js";
import Select from "./Select";

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResult: {},
            pageSize: 10
        };
        this.getData(this.state.pageSize);
    }
    getData(pageSize) {
        try {
            AjaxPOSTAsync(urlControlActionPagination, { "pageSize": pageSize }, "POST")
                .then((datum) => {
                    this.handleStateResultObject(datum);
                    console.dir(this.state);
                }).catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
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
            return {
                PageSize: Object.assign(state, object),
            };
        });
    }
    render() {
        return (
            <React.Fragment>
                <Select handleStatePageSize={this.handleStatePageSize}/>
                <ul className="pagination">
                    <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>

                    <li className="active"><a href="/Gipermall/Index/Page0/Size10">1</a></li>
                    <li className="waves-effect"><a href="/Gipermall/Index/Page1/Size10">2</a></li>
                    <li className="waves-effect"><a href="/Gipermall/Index/Page2/Size10">3</a></li>

                    <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
                </ul>
            </React.Fragment>
        );
    }
}

export default Pagination;