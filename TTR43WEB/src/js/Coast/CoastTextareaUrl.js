import PropTypes from "prop-types";
import React, { Component } from "react";
import { AjaxPOSTAsync } from "../utils.js";

class CoastTextareaUrl extends Component {
    constructor(props) {
        super(props);
    }
    getData(e) {
        const that = e.target;
        const data = this.props.data;
        AjaxPOSTAsync(urlControlActionGetCoastAsync, data, "POST")
            .then((datum) => {
                this.props.stateChange(datum);
            }).catch((error) => {
                console.error(error);
            });
    }
    render() {
        const data = this.props.data.url;
        return (
            <React.Fragment>
                <textarea
                    onInput={(e) => this.getData(e)}
                    cols="40"
                    rows="3"
                    defaultValue={data} />
            </React.Fragment>
        );
    }
}

export default CoastTextareaUrl;