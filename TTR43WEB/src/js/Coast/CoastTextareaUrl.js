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
            "https://gipermall.by/catalog/item_95308.html"
        ];
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    getData(e) {
        try {
            const _this = e.currentTarget;
            const _that = e.target;
            let dataTmp;
            switch (_this.tagName) {
                case "TEXTAREA":
                    dataTmp = _that.textContent.split(/\s|,/);
                    break;
                case "BUTTON":
                    dataTmp = this.state.value;
                    break;
                default:
                    break;
            }

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
            <div>
                <textarea
                    onChange={this.handleChange}
                    onBlur={(e) => this.getData(e)}
                    cols="40"
                    rows="3"
                    value={this.state.value}
                />
                <button
                    onClick={(e) => this.getData(e)}
                    className="btn waves-effect waves-light"
                    type="button"
                    name="action">Get<i className="material-icons right">send</i>
                </button>
            </div>
        );
    }
}

export default CoastTextareaUrl;