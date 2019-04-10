import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

import ButtonFavorite from "./Components/ButtonFavorite";

/**
 * Метод преобразовывает названия переменных в названия столбцов таблицы
 * @param {String} name - наименование переменной
 * @return {String} текст
 */
const _replacer = (name) => {
    return name.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
};

/**
 * Метод форматирует дату полученную с сервера в региональный формат
 * @param {String} date - текст
 * @return {Date} - Date
 */
const _dateConverter = (date) => {
    try {
        const dateC = Date.parse(date);
        const newDate = (new Date(dateC)).toLocaleString("RU-be");
        //console.log(newDate);
        return newDate;
    } catch (error) {
        //console.log(date);
        return date;
    }
};

/**
 * Метод форматирует текст в денежный формат
 * @param {String} cost - стоимость
 * @return {String}  - отформатированная стоимость
 */
const _moneyConverter = (cost) => {
    try {
        const money = cost;
        const result = money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        return `${result} р.`;
    } catch (error) {
        return cost;
    }
};

const dataFilter = (items, filter, AspNetCoreCookies) => {
    const data = [...items].filter((el, i) => {
        const item = String(el.name).toLowerCase();
        let flag = true;
        for (const iterator of filter) {
            flag = item.includes(iterator.toLowerCase());
            if (!flag) {
                return flag;
            }
        }

        return flag;
    });
    if (!AspNetCoreCookies) {
        data.length = 4;
    }
    return data;
};

const ProductInfo = (props) => {
    //console.dir(props);
    const { state: { AspNetCoreCookies = "", items = [], filter = [], favorite = [] }, urlControlAction = {}, stateChangeResult, getAllProductsFavorite } = props;

    const cardStickyAction = ({ date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", }) => {
        return `<a href="${url}" target="_blank">${name}(${markingGoods}) - ${price}руб. - ${priceWithoutDiscount}руб. (${date})</a>`;
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

    return (
        <div className="row">
            <div className="col s12">
                <table className="col s12 striped highlight" data-src={name}>
                    <thead id="tableTop">
                        <tr>
                            {
                                Array.from(items[0] || {}).map((el, i) => {
                                    if (el.toLowerCase() === "url") {
                                        return (<th key={i}>UPDATE</th>);
                                    } else if (el.toLowerCase() === "guid") {
                                        return (
                                            AspNetCoreCookies ? <th key={i} title="Guid">{"favorite"}</th> : null
                                        );
                                    } else {
                                        return (<th key={i}>{_replacer(el)}</th>);
                                    }
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataFilter(items, filter, AspNetCoreCookies).map((item, index) => {
                                return (
                                    <tr key={item.id ? item.id : index}>
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
                                                } else if (el.toLowerCase() === "guid") {
                                                    return (
                                                        AspNetCoreCookies
                                                            ? (<td key={i}>
                                                                <ButtonFavorite
                                                                    stateChangeResult={stateChangeResult}
                                                                    getAllProductsFavorite={getAllProductsFavorite}
                                                                    urlControlAction={urlControlAction}
                                                                    favorite={favorite}
                                                                    itemGuid={item[el]}
                                                                    itemId={item.id}
                                                                    itemURL={item.url}
                                                                    markingGoods={item.markingGoods} />
                                                            </td>)
                                                            : null
                                                    );
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
                                                        <a className="btn-floating btn-small waves-effect waves-light red">
                                                            <i className="material-icons"
                                                                onClick={e => dataUpdate(e)}
                                                                data-update-url={item[el]}>update</i>
                                                        </a>
                                                    </td>);
                                                } else {
                                                    return (
                                                        <td key={i}>
                                                            {item[el]}
                                                        </td>
                                                    );
                                                }
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
            </div>

        </div>
    );
};

ProductInfo.propTypes = {
    urlControlAction: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    handleStateResultObject: PropTypes.func.isRequired,
    stateChangeResult: PropTypes.func.isRequired,
};

export default ProductInfo;