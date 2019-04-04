import PropTypes, { number } from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class CoastTextareaUrl extends Component {

    static propTypes = {
        stateChangeResult: PropTypes.func.isRequired,
        urlControlAction: PropTypes.object.isRequired,
        AspNetCoreCookies: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            textarea: [],
            URLs: [],
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

    async updateAllItemsOnServer() {
        try {
            const { urlControlAction } = this.props;
            const response = await fetch(urlControlAction.urlControlActionGetAllItemsUrls, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
            const { description } = await response.json();
            this.sendURLsToServer(null, description, { urlControlAction });
        } catch (error) {
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    /**
     * метод метод пилит текст на массив полных адресов.
     * @param {string} text исходный текст;
     * @param {string} urlFormatter обработчик адреса;
     * @returns {Array} возвращает массив данных;
     */
    textURLsToArray = (text, urlFormatter) => {
        return [...(text.split(/\s|,|\s,/))].filter((item, i) => item !== "").map((e, i) => urlFormatter(e.trim()));
    }
    
    convertToFullURLs = (element) => {
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

    getURLArrayFromText = ({ textarea }, getItem_html, textURLsToArray) => {
        return Array.isArray(textarea)
            ? [...textarea]
            : textURLsToArray(textarea, getItem_html);
    }

    cardStickyAction = ({ date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", }) => {
        return `<a href="${url}" target="_blank">${name}(${markingGoods}) - ${price}руб. - ${priceWithoutDiscount}руб. (${date})</a>`;
    };

    async sendURLsToServer(e, formatteddURLToArray, { urlControlAction }) {
        try {

            const data = formatteddURLToArray || [];

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
                    this.props.stateChangeResult(json.items, "items");

                    M.toast({ html: this.cardStickyAction(json.items), displayLength: 8000, classes: "rounded" });

                    console.log(`${json.items.name}, ${json.items.price} / ${json.items.priceWithoutDiscount} | ${json.items.url}`);

                } else {
                    M.toast({ html: `Товар ${json.items.name} не изменился`, displayLength: 4000, classes: "rounded" });
                }

            }
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

    randomInteger = (min = 0, max = 5000) => Math.abs(Math.round(min - 0.5 + Math.random() * (max - min + 1)));

    createDataTable = async () => {
        try {
            this.setState({ textarea: [] });
            for (let i = 0; i < 300; i++) {
                let tmp = `https://gipermall.by/catalog/item_${99508 + i}.html`; //this.randomInteger(95308, 95408)
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
        const { AspNetCoreCookies } = this.props;
        return (
            <div className="row">
                <form>
                    <div className="col s12">
                        <div className="input-field ">
                            <textarea
                                placeholder={`Адрес товара "https://gipermall.by/cabinet/favorites/#/catalog/item_95308.html`}
                                id="textareaURLstorige"
                                className="materialize-textarea"
                                onChange={this.handleChange}
                                onBlur={this.handleChange}
                                value={this.state.textarea}
                            />
                        </div>
                    </div>
                    <div className="col s12">
                        <div className="col s3">
                            {
                                AspNetCoreCookies
                                    ? (
                                        <button
                                            onClick={(e) => this.updateAllItemsOnServer(e)}
                                            className="btn W100 waves-effect waves-light"
                                            type="button"
                                            name="action">Обновить все данные в базе<i className="material-icons left">cloud</i>
                                        </button>
                                    )
                                    : null
                            }
                        </div>
                        <div className="col s3">
                            {
                                AspNetCoreCookies
                                    ? (
                                        <button
                                            onClick={(e) => this.createDataTable(e)}
                                            className="btn W100 waves-effect waves-light"
                                            type="button"
                                            name="action">Создать случайные ссылки<i className="material-icons left">create</i>
                                        </button>
                                    )
                                    : null
                            }
                        </div>
                        <div className="col s3">
                            <button
                                onClick={(e) => this.sendURLsToServer(e, this.getURLArrayFromText(this.state, this.convertToFullURLs, this.textURLsToArray), this.props)}
                                className="btn W100 waves-effect waves-light"
                                type="button"
                                name="action">Отправить<i className="material-icons right">send</i>
                            </button>
                        </div>
                        <div className="col s3">
                            <div className={`progress`} id="progressBar">
                                <div className="determinate" style={{ width: this.state.progress + "%" }}></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default CoastTextareaUrl;