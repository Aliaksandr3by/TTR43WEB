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
            progress: 0,
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

    getProgress = async (progress, length) => progress += 100 / length;

    OptionsURIinBase = async (url, elURI) => {
        try {
            const response = await fetch(url, {
                method: "OPTIONS", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "ElementURI": elURI
                }),
            });
            const json = await response.json();
            console.warn(json);
            //this.setState({ textarea: json.description });
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    };

    async getData(e) {
        //изменяет исходное состояние
        let dataTmp = (el = this.state.textarea) => {
            try {
                if (typeof el === "string") {
                    return (el.replace(/'|«|»|\\|"/g, "")
                        .split(/\s|,|\s,/))
                        .map((e, i) => Number(e) ? `https://gipermall.by/catalog/item_${Number(e)}.html` : e)
                        .filter((item, i) => item !== "");
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
                this.OptionsURIinBase(urlControlActionOptionsURIinBase, iterator);
                const response = await fetch(this.props.urlData, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "idGoods": iterator }),
                });
                const json = await response.json();
                this.props.stateChangeResult(json.description);
                this.setState({ progress: await this.getProgress(this.state.progress, data.length) });
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
                <div className="col s4">
                    <button
                        onClick={(e) => this.getDataTable(e)}
                        className="btn waves-effect waves-light"
                        type="button"
                        name="action">Получить данные<i className="material-icons left">cloud</i>
                    </button>
                    <button
                        onClick={(e) => this.getData(e)}
                        className="btn waves-effect waves-light"
                        type="button"
                        name="action">Отправить<i className="material-icons right">send</i>
                    </button>
                </div>
                <div className="col s8 input-field ">
                    <textarea
                        id="textareaURLstorige"
                        className="browser-default"
                        placeholder="URL"
                        onChange={this.handleChange}
                        onClick={this.handleChange}
                        value={this.state.textarea}
                    />
                </div>
                <div className="progress">
                    <div className="determinate" style={{ width: this.state.progress + "%" }}></div>
                </div>
            </div>
        );
    }
}

export default CoastTextareaUrl;