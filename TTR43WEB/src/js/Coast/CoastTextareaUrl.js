import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class CoastTextareaUrl extends Component {
    static propTypes = {
        stateChangeResult: PropTypes.func.isRequired,
        urlControlAction: PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            textarea: [],
            error: null,
            isLoaded: false,
            progress: 0,
            resultBaseDataAdd: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        M.textareaAutoResize(document.getElementById("textareaURLstorige"));
        this.setState({ "textarea": this.dataOperatorLocalS("dataTmp") });
    }

    async componentDidUpdate() {
        M.textareaAutoResize(document.getElementById("textareaURLstorige"));
        this.dataOperatorLocalS("dataTmp", this.state.textarea);
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
            const { urlControlAction } = this.props;
            const response = await fetch(urlControlAction.urlControlActionGetCoastAsync, {
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
        }
    };

    handleChange(event) {
        const data = event.target.value;
        this.setState({ "textarea": data });
    }

    async getDataTable() {
        try {
            const { urlControlAction } = this.props;
            const response = await fetch(urlControlAction.urlControlActionGetAllItemsUrls, {
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
        }
    }

    formatDataURL = ({ textarea }) => {
        return Array.isArray(textarea)
            ? [...textarea]
            : [...(textarea.split(/\s|,|\s,/))]
                .filter((item, i) => item !== "")
                .map((e, i) => this.getItem_html(e));
    }

    getItem_html = (element) => {
        const _element = element.replace(/'|«|»|\\|"/g, ""); //!очищает данные от лишних символов
        let tmp = "";
        if (typeof _element === "number" || Number(_element)) {
            tmp = `https://gipermall.by/catalog/item_${Number(_element)}.html`;
            return tmp;
        } else if (typeof _element === "string") {
            let sowp = String(_element).match(/item_\d*.html$/i);
            tmp = sowp[0] ? `https://gipermall.by/catalog/${sowp[0]}` : "";
            return tmp;
        } else {
            return tmp;
        }
    }

    async getData(e) {
        try {
            const { urlControlAction } = this.props;
            const data = this.formatDataURL(this.state);
            this.setState({ progress: 0 });
            //this.OptionsURIinBase(urlControlActionOptionsURIinBase, iterator);
            for (const iterator of data) {

                const response = await fetch(urlControlAction.urlControlActionGetCoastAsync, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "idGoods": iterator }),
                });

                const json = await response.json();

                this.setState({ progress: await this.getProgress(this.state.progress, data.length) });

                if (json.resultBaseDataAdd) {
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

    handleStateResultArray = (array, name) => {
        this.setState((state, props) => {
            return {
                [name]: [...state[name], array]
            };
        });
    }

    createDataTable = async () => {
        try {

            // const description = [...Array(1000)].map((item, i) => {
            //     let tmp = [`https://gipermall.by/catalog/item_${Number(i)}.html`];
            //     this.handleStateResultArray(tmp, "textarea");
            //     return tmp;
            // });

            this.setState({ textarea: [] });
            const dd = 2500 + 1;
            for (let i = dd; i < dd + 500; i++) {
                let tmp = `https://gipermall.by/catalog/item_${Number(i)}.html`;
                this.handleStateResultArray(tmp, "textarea");
            }

        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="input-field ">
                        <textarea
                            id="textareaURLstorige"
                            className="materialize-textarea"
                            onChange={this.handleChange}
                            onClick={this.handleChange}
                            value={this.state.textarea}
                        />
                    </div>
                </div>
                <div className="col s12">
                    <button
                        onClick={(e) => this.getDataTable(e)}
                        className="btn waves-effect waves-light"
                        type="button"
                        name="action">Получить данные<i className="material-icons left">cloud</i>
                    </button>
                    <button
                        onClick={(e) => this.createDataTable(e)}
                        className="btn waves-effect waves-light"
                        type="button"
                        name="action">Создать ссылки<i className="material-icons left">create</i>
                    </button>
                    <button
                        onClick={(e) => this.getData(e)}
                        className="btn waves-effect waves-light"
                        type="button"
                        name="action">Отправить<i className="material-icons right">send</i>
                    </button>
                    <div className={`progress`} id="progressBar">
                        <div className="determinate" style={{ width: this.state.progress + "%" }}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CoastTextareaUrl;