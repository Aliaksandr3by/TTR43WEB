import React from "react";
import PropTypes from "prop-types";
import { AjaxPOSTAsync } from "../utils.js";

class CreateSelect extends React.Component {
    static propTypes = {
        handleStatePageSize: PropTypes.func.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            value: this.getPageSize(window.localStorage.getItem("pageSize")),
            valueDefault: this.props.valueArray,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    getPageSize(tmp) {
        return tmp ? Number(tmp) : 10;
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
        this.props.handleStatePageSize({ pageSize: Number(event.target.value) });
        window.localStorage.setItem("pageSize", event.target.value);
    }
    render() {
        return (
            <React.Fragment>
                <label>Browser Select</label>
                <select className="browser-default" value={this.state.value} onChange={this.handleChange}>
                    {
                        this.state.valueDefault.map((item, key) => {
                            return (
                                <option key={key} value={item}>{item}</option>
                            );
                        })
                    }
                </select>
            </React.Fragment>
        );
    }
}

export default CreateSelect;