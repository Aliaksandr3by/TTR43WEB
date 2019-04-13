import PropTypes, { number } from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class CoastTextareaUrl extends Component {

    static propTypes = {
        stateChangeResult: PropTypes.func.isRequired,
        handleStateProperty: PropTypes.func.isRequired,
        handleStateResultObject: PropTypes.func.isRequired,
        urlControlAction: PropTypes.object.isRequired,
        state: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            textarea: "",
            URLs: [],
            error: null,
            isLoaded: false,
            progress: 0,
        };
        this.textAreaUpdater = this.textAreaUpdater.bind(this);
    }

    componentDidMount() {
        M.textareaAutoResize(document.getElementById("textareaURLstorige"));
        this.setState({ "textarea": this.dataOperatorLocalS("dataTmp") });
    }

    async componentDidUpdate() {
        M.textareaAutoResize(document.getElementById("textareaURLstorige"));
        this.dataOperatorLocalS("dataTmp", this.state.textarea);
    }
    
    handleStateResultArray = (array, name) => {
        this.setState((state, props) => {
            return {
                [name]: [...state[name], array]
            };
        });
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
            return window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : "";
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

    textAreaUpdater(event) {
        const data = event.target.value;
        this.setState({ "textarea": data });
    }

    async updateAllItemsOnServer() {
        try {
            const { urlControlAction } = this.props;
            const response = await fetch(urlControlAction.urlControlActionUpdateAllFavorites, {
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
        const domen = String(_element).match(/^https:\/\/(\w*[\w|-]\w*.by)/i) || [`https://gipermall.by`, `https://e-dostavka.by`];
        let tmp = "";
        if (typeof _element === "number" || Number(_element)) {
            tmp = `${domen[0]}/catalog/item_${Number(_element)}.html`;
            return tmp;
        } else if (typeof _element === "string") {
            const sowp = String(_element).match(/item_\d*.html$/i);
            if (sowp) tmp = sowp[0] ? `${domen[0]}/catalog/${sowp[0]}` : "";
            return tmp;
        } else {
            return tmp;
        }
    }

    getURLArrayFromText = ({ textarea }, convertToFullURLs, textURLsToArray) => {
        return Array.isArray(textarea)
            ? [...textarea]
            : textURLsToArray(textarea, convertToFullURLs);
    }

    cardStickyAction = ({ date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", }) => {
        return `<a href="${url}" target="_blank">${name}(${markingGoods}) - ${price}руб. - ${priceWithoutDiscount}руб. (${date})</a>`;
    };

    /**
     * 
     * @param {Метод запрашивает у сарвера обновить избранное} e 
     * @param {*} favorite 
     * @param {*} urlControlAction 
     */
    async updateFavoritsOnServer(e, favorite = [], urlControlAction, handleStateResultObject) {
        try {
            const guidProducts = favorite.map((eF, iF) => eF.guid);

            const response = await fetch(urlControlAction.urlControlActionUpdateAllFavorites, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(guidProducts),
            });

            const json = await response.json();

            console.log(json);

            if (json.productEntity) {
                console.log(json.productEntity);
                await handleStateResultObject(json);
                this.setState({"textarea": json.productEntity.map((e) => e.url)});
            }


        } catch (error) {
            console.error(error);
        }
    }

    async sendURLsToServer(e, data, { urlControlAction }) {
        try {

            this.setState({ progress: 0 });

            //this.OptionsURIinBase(urlControlActionOptionsURIinBase, iterator);
            for (const iterator of data) {

                if (iterator) {

                    const response = await fetch(urlControlAction.urlControlActionGetCoastAsync, {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ "idGoods": iterator }),
                    });

                    const json = await response.json();

                    this.setState({ progress: await this.getProgress(this.state.progress, data.length) });

                    if (!json.guidIsEmpty && !json.description) {

                        this.props.stateChangeResult(json.items, "items");

                        M.toast({ html: this.cardStickyAction(json.items), displayLength: 8000, classes: "rounded" });

                        console.log(`${json.items.name}, ${json.items.price} / ${json.items.priceWithoutDiscount} | ${json.items.url}`);

                    } else if (!json.description) {

                        M.toast({ html: `Товар ${json.items.name} не изменился`, displayLength: 4000, classes: "rounded" });

                    } else {

                        console.error(json.description);

                    }
                } else {
                    console.log(`"${iterator}" - ошибка адреса`);
                }
            }
            this.setState({ progress: 0 });
        } catch (error) {
            console.error(error);
        }
    }

    randomInteger = (min = 0, max = 5000) => Math.abs(Math.round(min - 0.5 + Math.random() * (max - min + 1)));

    createDataTable = async () => {
        try {
            this.setState({ textarea: [] });
            for (let i = 0; i < 300; i++) {
                const tmp = `https://gipermall.by/catalog/item_${99508 + i}.html`; //this.randomInteger(95308, 95408)
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
        const { AspNetCoreCookies = "", favorite } = this.props.state;
        const { urlControlAction = {}, handleStateResultObject = null } = this.props;

        const data = this.getURLArrayFromText(this.state, this.convertToFullURLs, this.textURLsToArray) || [];

        return (
            <div className="row">
                <div>
                    <div className="col s12">
                        <div className="input-field ">
                            <textarea
                                placeholder={`https://gipermall.by/cabinet/favorites/#/catalog/item_95308.html`}
                                id="textareaURLstorige"
                                className="materialize-textarea"
                                onChange={this.textAreaUpdater}
                                onBlur={this.textAreaUpdater}
                                value={this.state.textarea}
                            />
                            <label className="active" htmlFor="textareaURLstorige">{"Адрес товара"}</label>
                        </div>
                    </div>
                    <div className="col s12">
                        <button
                            onClick={(e) => this.sendURLsToServer(e, data, this.props)}
                            className="btn W100 waves-effect waves-light"
                            type="button"
                            style={{
                                backgroundImage: `radial-gradient(red ${this.state.progress}%, yellow ${this.state.progress + 45}%, green ${100 - this.state.progress}%)`,
                            }}
                            name="action">Отправить<i className="material-icons right">send</i>
                        </button>
                    </div>
                    <div className="col s12">
                        <div className={`progress`} id="progressBar">
                            <div className="determinate" style={{ width: this.state.progress + "%" }}></div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            AspNetCoreCookies
                                ? (
                                    <React.Fragment>
                                        <div className="col s3">
                                            <button
                                                onClick={(e) => this.updateAllItemsOnServer(e)}
                                                className="btn waves-effect waves-light"
                                                type="button"
                                                name="action">Обновить все данные в базе<i className="material-icons left">cloud</i>
                                            </button>
                                        </div>
                                        <div className="col s3">
                                            <button
                                                onClick={(e) => this.createDataTable(e)}
                                                className="btn waves-effect waves-light"
                                                type="button"
                                                name="action">Создать случайные ссылки<i className="material-icons left">create</i>
                                            </button>
                                        </div>
                                        <div className="col s3">
                                            <button
                                                onClick={(e) => this.updateFavoritsOnServer(e, favorite, urlControlAction, handleStateResultObject)}
                                                className="btn waves-effect waves-light left"
                                                type="button"
                                                name="action">Обновить избранное<i className="material-icons left">cached</i>
                                            </button>
                                        </div>
                                    </React.Fragment>
                                )
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default CoastTextareaUrl;