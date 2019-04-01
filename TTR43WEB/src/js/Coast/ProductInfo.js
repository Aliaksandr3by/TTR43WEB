import PropTypes from "prop-types";
import React from "react";
import M from "materialize-css";

const _replacer = (item) => {
    return item.replace(/([A-Z])/g, " $1").replace(/^./,
        (str) => {
            return str.toUpperCase();
        });
};

const _dateConverter = (item) => {
    try {
        const dateC = Date.parse(item);
        const dateJS = new Date(dateC);
        const result = dateJS.toLocaleString("RU-be");
        return result;
    } catch (error) {
        return item;
    }
};

const _moneyConverter = (item) => {
    try {
        const money = item;
        const result = money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        return `${result} р.`;
    } catch (error) {
        return item;
    }
};

export const ProductInfo = (props) => {

    const { state: { AspNetCoreCookies = "", items = [], pageSize, productPage }, urlControlAction = {}, handleStateResultObject, stateChangeResult } = props;

    const cardStickyAction = ({ date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", }) => {
        return `<a href="${url} target="_blank">${name}(${markingGoods}) - ${price}руб. - ${priceWithoutDiscount}руб. (${date})</a>`;
    };

    /**
     * Метод обновляет данные выбранного продукта по нажатию на кнопку обновления;
     * @param {Event} e 
     */
    const dataUpdate = async (e) => {
        try {
            const response = await fetch(urlControlAction.urlControlActionGetCoastAsync, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "idGoods": e.target.getAttribute("data-update-url"),
                }),
            });
            const json = await response.json();
            M.toast(
                {
                    html: String(cardStickyAction(json.items)),
                    classes: "rounded"
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = async (e) => {
        try {
            const response = await fetch(`${urlControlAction.urlControlActionGETGipermallItemsProduct}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "pageSize": pageSize,
                    "productPage": productPage,
                    "addItems": e.target.value,
                    "skippedItems": items.length,
                }),
            });

            const result = await response.json();

            stateChangeResult(result.items, "items");

        } catch (error) {
            handleStateResultObject({
                isLoaded: true,
                error
            });
        }
    };

    const renderTbodyTable = (itemsEl = [], AspNetCoreCookies = "") => {
        const data = Array.from(itemsEl);
        if (!AspNetCoreCookies) {
            data.length = 4;
        }
        return (
            <tbody>
                {
                    data.map((item, index) => {
                        return (
                            <tr key={index}>
                                {
                                    AspNetCoreCookies ? <td>{"favorite"}</td> : null
                                }
                                {
                                    Object.keys(item).map((el, i) => {
                                        if (el.toLowerCase() === "id") {
                                            return (<th key={i} name={`ID${item.id}`}>
                                                <a href="#!">{item[el]}</a>
                                            </th>);
                                        } else if (el.toLowerCase() === "name") {
                                            return (<td key={i}>
                                                <a target="_blank" rel="noopener noreferrer" href={item["url"]}>{item[el]}</a>
                                            </td>);
                                        } else if (el.toLowerCase() === "date") {
                                            return (<td key={i}>
                                                {_dateConverter(item[el])}
                                            </td>);
                                        } else if (el.toLowerCase() === "price") {
                                            return (<td key={i} title={item[el]}>
                                                {_moneyConverter(item[el])}
                                            </td>);
                                        } else if (el.toLowerCase() === "pricewithoutdiscount") {
                                            return (<td key={i} title={item[el]}>
                                                {_moneyConverter(item[el])}
                                            </td>);
                                        } else if (el.toLowerCase() === "url") {
                                            return (<td key={i} >
                                                <a
                                                    className="btn-floating btn-small waves-effect waves-light red"                                                            >
                                                    <i className="material-icons"
                                                        onClick={e => dataUpdate(e)}
                                                        data-update-url={item[el]}>update</i>
                                                </a>
                                            </td>);
                                        } else {
                                            return (<td key={i}>
                                                {item[el]}
                                            </td>);
                                        }
                                    })
                                }
                            </tr>
                        );
                    })
                }
            </tbody>
        );
    };

    return (
        <React.Fragment>
            <table className="col s12 striped highlight" data-src={name}>
                <caption><p>{"name"}</p></caption>
                <thead id="tableTop">
                    <tr>
                        {
                            AspNetCoreCookies ? <td>{"favorite"}</td> : null
                        }
                        {
                            Object.entries(items[0]).map(([el, val], i) => {
                                if (el.toLowerCase() === "url") {
                                    return (<th key={i}>UPDATE</th>);
                                } else {
                                    return (<th key={i}>{_replacer(el)}</th>);
                                }
                            })
                        }
                    </tr>
                </thead>
                {
                    renderTbodyTable(items, AspNetCoreCookies)
                }
                <tfoot>

                </tfoot>
            </table>
            <div>
                <button className={"btn"} onClick={onRefresh.bind(this)} value={1} type="button">{"1"}</button>
            </div>
        </React.Fragment>
    );
};

ProductInfo.propTypes = {
    urlControlAction: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    handleStateResultObject: PropTypes.func.isRequired,
    stateChangeResult: PropTypes.func.isRequired,
};

export default ProductInfo;