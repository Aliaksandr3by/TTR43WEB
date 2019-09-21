import PropTypes, { number } from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

class CoastTextareaUrl extends Component {

    /**
 * Метод форматирует дату полученную с сервера в региональный формат
 * @param {String} date - текст
 * @return {Date} - Date
 */
    _dateConverter = (date) => {
        try {
            const newDate = (new Date(date)).toLocaleString("RU-be");
            return newDate;
        } catch (error) {
            return date || Date.now;
        }
    };

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
            updateFavotite: false,
            stop: true,
            index: Number(localStorage.getItem("index") || 0),
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

    stateUpdateMono = async (name, result) => {
        this.setState((state, props) => {
            return {
                [name]: result
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

    cardStickyAction = (q1 = {}, q2 = {}, q3 = {}) => {
        try {
            const { date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", } = q1;
            const { fullEstimatedValue: priceMin = 0 } = q2 || {};
            const { fullEstimatedValue: priceMax = 0 } = q3 || {};

            return `<a href="${url}" target="_blank">${name}(№${markingGoods})-${price}р. <b>[мин:${priceMin}р-мак:${priceMax}р]</b> - ${priceWithoutDiscount}р. (${this._dateConverter(date)})</a>`;

        } catch (error) {
            return `<a href="" target="_blank">${error}</a>`;
        }
    };

    /**
     *  Метод запрашивает у сервера обновить все избранное
     * @param {*} e 
     * @param {*} favorite 
     * @param {*} urlControlAction 
     */
    async updateFavoritsOnServer(e, favorite = [], urlControlAction, handleStateResultObject) {
        try {

            this.setState({ "updateFavotite": true });

            const guidProducts = favorite.map((eF, iF) => eF.guid);

            const response = await fetch(urlControlAction.urlControlActionUpdateFavoritesItems, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(guidProducts),
            });

            const json = await response.json();

            // console.log(json);

            if (json.productEntity) {
                // console.log(json.productEntity);
                await handleStateResultObject(json);
                this.setState({ "textarea": json.productEntity.map((e) => e.url) });
            }
            this.setState({ "updateFavotite": false });

        } catch (error) {
            console.error(error);
            this.setState({ "updateFavotite": false });
        }
    }

    async sendURLsToServer(e, data, { urlControlAction }) {
        try {

            this.setState({ progress: 0 });

            //this.OptionsURIinBase(urlControlActionOptionsURIinBase, iterator);
            for (const iterator of data) {

                if (iterator) {

                    // console.log(iterator);

                    const response = await fetch(urlControlAction.urlControlActionGetCoastAsync, {
                        method: "POST", // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "IdGoods": iterator,
                            "FavoriteSelect": this.props.state.favoriteSelect,
                        }),
                    });

                    const json = await response.json();

                    // console.log(json);

                    this.setState({ progress: await this.getProgress(this.state.progress, data.length) });

                    if (!json.isPresent && !json.description) {

                        this.props.stateChangeResult(json.items, "items");

                        M.toast({ html: this.cardStickyAction(json.items, json.itemsMinCost, json.itemsMaxCost), displayLength: 8000, classes: "rounded" });

                        console.log(`${json.items.name}, ${json.items.price} / ${json.items.priceWithoutDiscount} | ${json.items.url}`);

                    } else if (json.isPresent && !json.description) {

                        // console.log(json);

                        if (json.itemsMinCost && json.itemsMaxCost) {

                            const { price: priceMin = 0 } = json.itemsMinCost;
                            const { price: priceMax = 0 } = json.itemsMaxCost;

                            M.toast({ html: `Товар ${json.items.name} не изменился [мин:${priceMin}р-мак:${priceMax}р]`, displayLength: 4000, classes: "rounded" });

                        } else if (json.itemsMinCost) {
                            const { price: priceMin = 0 } = json.itemsMinCost;

                            M.toast({ html: `Товар ${json.items.name} не изменился [мин:${priceMin}]`, displayLength: 4000, classes: "rounded" });
                        }
                        else if (json.itemsMaxCost) {

                            const { price: priceMax = 0 } = json.itemsMaxCost;

                            M.toast({ html: `Товар ${json.items.name} не изменился [мак:${priceMax}р]`, displayLength: 4000, classes: "rounded" });

                        } else {
                            M.toast({ html: `Товар ${json.items.name}`, displayLength: 4000, classes: "rounded" });
                        }


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

    createDataTable = async (e) => {
        try {
            await this.stateUpdateMono("stop", true);

            let index = this.state.index;

            while (this.state.stop) {
                const data = `https://gipermall.by/catalog/item_${index}.html`; //this.randomInteger(95308, 95408)

                const arr = [];
                arr.push(data);
                // console.log(arr);
                await this.sendURLsToServer(e, arr, this.props);
                index++;
                localStorage.setItem("index", index),
                await this.stateUpdateMono("index", index);
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
        const { updateFavotite } = this.state;

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
                            <details>
                                <summary>JS код (для консоли) для получения ссылок</summary>
                                <pre onClick={e => {
                                    navigator.clipboard.writeText(e.target.textContent)
                                        .then()
                                        .catch((error) => {
                                            console.error("Async: Could not copy text: ", error.message);
                                        });
                                }}>
                                    {`
(() => {
    try {
        const tmp = Array.from(document.querySelectorAll("a.to_favorite.fa.fa-heart")).map(e => e.getAttribute("data-product-id"));
        const div = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
        const tmpURL = [];
        tmp.map(e => {
            const a = document.createElement("p");
            const tmp = \`https://\${document.domain}/catalog/item_\${e.replace(/,/g, "")}.html\`;
            a.textContent = tmp;
            div.appendChild(a);
            tmpURL.push(tmp);
        });

        const data = tmpURL.join("; ");
        console.dir(data);

    } catch (error) {
        console.error(error);
    }
})();
`}
                                </pre>
                            </details>
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
                                                title={"перебирает все товары"}
                                                name="action">Перебор товаров<i className="material-icons left">create</i>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    this.setState((state, props) => {
                                                        const flag = state.stop;
                                                        return { stop: !flag };
                                                    });
                                                }}
                                                className="btn red"
                                                type="button "
                                                name="action"><i className="material-icons left">{this.state.stop ? `stop` : "play_arrow"}</i>
                                            </button>
                                        </div>
                                        <div className="col s3">
                                            {
                                                updateFavotite
                                                    ? (
                                                        <div className="preloader-wrapper active">
                                                            <div className="spinner-layer spinner-red-only">
                                                                <div className="circle-clipper left">
                                                                    <div className="circle"></div>
                                                                </div><div className="gap-patch">
                                                                    <div className="circle"></div>
                                                                </div><div className="circle-clipper right">
                                                                    <div className="circle"></div>
                                                                </div>
                                                            </div>
                                                        </div>)
                                                    : (
                                                        <button
                                                            onClick={(e) => this.updateFavoritsOnServer(e, favorite, urlControlAction, handleStateResultObject)}
                                                            className="btn waves-effect waves-light left"
                                                            type="button"
                                                            title={"Обновить избранное"}
                                                            name="action">Обновить избранное<i className="material-icons left">cached</i>
                                                        </button>)
                                            }
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