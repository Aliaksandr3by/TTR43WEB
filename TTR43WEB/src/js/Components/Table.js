import PropTypes from "prop-types";
import React, { Component } from "react";
import { AjaxPOSTAsync } from "../utils.js";

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: props.datum,
        };
        this.onDismiss = this.onDismiss.bind(this);
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        console.dir(error);
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.dir(error);
        console.dir(info);
        logErrorToMyService(error, info);
    }

    onDismiss(id) {
        const isNotId = item => item.id !== id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({ list: updatedList });
    }

    replacer(item) {
        return item.replace(/([A-Z])/g, " $1").replace(/^./, function (str) { return str.toUpperCase(); });
        return item.toLocaleLowerCase().replace(new RegExp("_", "g"), " ");
    }

    CreateTH(data) {
        const datum = data;
        if (!datum) {
            return (
                <tr></tr>
            );
        } else {
            return (
                <tr key={datum.id}>
                    {
                        Object.keys(datum).map((item, i) =>
                            <th key={i}>
                                {this.replacer(item)}
                            </th>
                        )
                    }
                </tr>
            );
        }
    }

    onGet(id) {
        console.log(id);
    }

    CreateTR(data) {
        const datum = data;
        return (
            <tr key={datum.id} onClick={() => this.onGet(datum.id)}>
                {
                    Object.keys(datum).map((item, i) => {
                        if (item.toUpperCase() === "ID") {
                            return <th key={i}>
                                {datum[item]}
                                <span>
                                    <button
                                        onClick={() => this.onDismiss(datum.id)}
                                        type="button"
                                        className="btn-floating btn-small waves-effect waves-light red"
                                    >
                                        <i className="material-icons">remove</i>
                                    </button>
                                </span>
                            </th>;
                        } else {
                            return <td key={i} title={item}>
                                {datum[item]}
                            </td>;
                        }
                    })
                }
            </tr>
        );
    }

    render() {
        const temp = this.state.list;
        return (
            <details><summary>{this.props.name}</summary>
                <table className={this.props.className}>
                    <caption><p>{this.props.name}</p></caption>
                    <thead>
                        {this.CreateTH(temp[0])}
                    </thead>
                    <tbody>
                        {temp.map((data) => this.CreateTR(data))}
                    </tbody>
                </table>
            </details>
        );
    }
}

export default Table;