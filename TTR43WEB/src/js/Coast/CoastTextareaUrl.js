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
            textarea: [],
            error: null,
            isLoaded: false,
            progress: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    getProgress = async (progress, length) => progress += 100 / length;

    /**
     * метод заносит и получает данные из LocalStorage.
     * @param {string} key rлюч переменной;
     * @param {string} value значение переменной;
     * @returns {Array} возвращает массив данных или пустой массив;
     * @returns {boolean} возвращает результат записи;
     */
    dataOperatorLocalS = (key, value = null) => {
        if (key && !value) {
            return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : [];
        } else if (key && value) {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } else {
            return false;
        }
    }

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
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
            console.error(error);
        }
    };

    componentDidMount() {
        this.setState({ "textarea": this.dataOperatorLocalS("dataTmp") });
    }

    async componentDidUpdate() {
        this.dataOperatorLocalS("dataTmp", this.state.textarea);
    }

    handleChange(event) {
        const data = event.target.value;
        this.setState({ "textarea": data });
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

    formatDataURL = ({ textarea }) => {
        return Array.isArray(textarea)
            ? textarea
            : (textarea.replace(/'|«|»|\\|"/g, "")
                .split(/\s|,|\s,/))
                .map((e, i) => Number(e) ? `https://gipermall.by/catalog/item_${Number(e)}.html` : e)
                .filter((item, i) => item !== "");
    }

    async getData(e) {
        try {
            const data = this.formatDataURL(this.state);
            this.setState({ progress: 0 });
            for (const iterator of data) {

                //this.OptionsURIinBase(urlControlActionOptionsURIinBase, iterator);

                const response = await fetch(this.props.urlData, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "idGoods": iterator }),
                });

                const json = await response.json();

                this.setState({ progress: await this.getProgress(this.state.progress, data.length) });

                if (json.description.id !== 0) {
                    this.props.stateChangeResult(json.description, "products");

                    M.toast({ html: `Товар ${json.description.name} добавлен, цена ${json.description.price} `, displayLength: 4000, classes: "rounded" });

                    console.log(json.description.name);
                } else {
                    M.toast({ html: `Товар ${json.description.name} не изменился`, displayLength: 4000, classes: "rounded" });
                }
            }
            //
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        return (
            <div >
                <div className={`progress`} id="progressBar">
                    <div className="determinate" style={{ width: this.state.progress + "%" }}></div>
                </div>
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
            </div>
        );
    }
}

export default CoastTextareaUrl;