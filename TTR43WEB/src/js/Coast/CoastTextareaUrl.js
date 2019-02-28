import PropTypes from "prop-types";
import React, { Component } from "react";
import { AjaxPOSTAsync } from "../utils.js";

class CoastTextareaUrl extends Component {
    static propTypes = {
        stateChangeResult: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            "value": this.dataTmp(),
        };
        this.handleChange = this.handleChange.bind(this);
    }
    dataTmp() {
        const data = window.localStorage.getItem("dataTmp");
        return data ? JSON.parse(data) : [
            "https://gipermall.by/catalog/item_95308.html", 
            "https://gipermall.by/catalog/item_26042.html", 
            "https://gipermall.by/catalog/item_769905.html", 
            "https://gipermall.by/catalog/item_203031.html"];
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    getData(e) {
        try {
            const that = e.target.textContent;
            const dataTmp = that.split(/\s|,/);
            const dataSend = {
                value: dataTmp
            };
            window.localStorage.setItem("dataTmp", JSON.stringify(dataTmp));
            AjaxPOSTAsync(urlControlActionGetCoastAsync, dataSend, "POST")
                .then((datum) => {
                    this.props.stateChangeResult(datum);

                }).catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        return (
            <React.Fragment>
                <textarea
                    onBlur={(e) => this.getData(e)}
                    onFocus={(e) => this.getData(e)}
                    onChange={this.handleChange}
                    cols="40"
                    rows="3"
                    value={this.state.value}
                />
            </React.Fragment>
        );
    }
}

export default CoastTextareaUrl;