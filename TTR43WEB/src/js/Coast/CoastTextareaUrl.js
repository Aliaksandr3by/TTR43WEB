import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

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
        const data = event.target.value;
        this.setState({ "textarea": data });
        window.localStorage.setItem("dataTmp", JSON.stringify(data));
    }

    async getDataTable() {
        try {
            const response = await fetch(urlControlActionGetAllItemsUrls, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({

                }),
            });
            const json = await response.json();
            this.setState({ textarea: json.description });
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
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
                if (json.description.id !== 0) {
                    M.toast(
                        {
                            html: `${json.description.name} добавлен в базу данных`,
                            classes: "rounded"
                        }
                    );
                    console.log(json.description.name);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        return (
            <div className="row">
                <button
                    onClick={(e) => this.getDataTable(e)}
                    className="btn waves-effect waves-light"
                    type="button"
                    name="action">Получить данные<i className="material-icons left">cloud</i>
                </button>
                <div className="input-field col s12">
                    <textarea
                        id="textareaURLstorige"
                        className="materialize-textarea"
                        placeholder="URL"
                        onChange={this.handleChange}
                        value={this.state.textarea}
                    />
                    <label htmlFor="textareaURLstorige">Textarea</label>
                </div>
                <button
                    onClick={(e) => this.getData(e)}
                    className="btn waves-effect waves-light"
                    type="button"
                    name="action">Отправить<i className="material-icons right">send</i>
                </button>
            </div>
        );
    }
}

export default CoastTextareaUrl;