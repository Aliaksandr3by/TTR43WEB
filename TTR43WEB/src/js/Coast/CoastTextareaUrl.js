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
            idGoods: this.dataTmp(),
            textarea: this.dataTmp(),
            error: null,
            isLoaded: false,
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
        this.setState({ "textarea": event.target.value });
    }
    getData(e) {
        try {
            const _this = e.currentTarget;
            const _that = e.target;
            let dataTmp;

            switch (_this.tagName) {
                case "TEXTAREA":
                    dataTmp = (_that.textContent.replace(/'|«|»|\\|"/g, "").split(/\s|,|\s,/)).filter((item, i) => {
                        return item !== "";
                    });
                    break;
                case "BUTTON":
                    dataTmp = this.state.idGoods;
                    break;
                default:
                    break;
            }

            window.localStorage.setItem("dataTmp", JSON.stringify(dataTmp));

            Array.from(dataTmp).forEach((element, i) => {
                AjaxPOSTAsync(urlControlActionGetCoastAsync, { "idGoods": element }, "POST")
                    .then((datum) => {
                        this.props.stateChangeResult(datum.description);
                    }).catch((error) => {
                        console.error(error);
                    });
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
                    rows="7"
                    value={this.state.textarea}
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