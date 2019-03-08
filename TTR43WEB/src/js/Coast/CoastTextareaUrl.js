import PropTypes from "prop-types";
import React, { Component } from "react";

class CoastTextareaUrl extends Component {
    static propTypes = {
        stateChangeResult: PropTypes.func.isRequired,
        urlData: PropTypes.string.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
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
    async getData(e) {
        //изменяет исходное состояние
        let dataTmp = (el = this.state.textarea) => {
            try {
                if (typeof el === "string") {
                    return (el.replace(/'|«|»|\\|"/g, "").split(/\s|,|\s,/)).filter((item, i) => {
                        return item !== "";
                    });
                } else if (Array.isArray(el)) {
                    return el;
                } else {
                    return;
                }
            } catch (error) {
                return `${typeof el} error`;
            }
        };

        const data = dataTmp(this.state.textarea);

        window.localStorage.setItem("dataTmp", JSON.stringify(data));

        try {
            for (const iterator of data) {
                const response = await fetch(this.props.urlData, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "idGoods": iterator }),
                });
                const json = await response.json();
                this.props.stateChangeResult(json.description);
            }
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        return (
            <div>
                <textarea
                    onChange={this.handleChange}
                    //onBlur={(e) => this.getData(e)}
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