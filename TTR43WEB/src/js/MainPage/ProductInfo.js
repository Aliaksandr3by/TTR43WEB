import PropTypes from "prop-types";
import React from "react";
import M from "materialize-css";

import ButtonFavorite from "./Components/ButtonFavorite";
import AllProductsFinder from "./Components/AllProductsFinder";

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
        const newDate = (new Date(date)).toLocaleString("RU-be");
        return newDate;
    } catch (error) {
        return date || Date.now;
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

const dataFilter = (items, filter, AspNetCoreCookies, favorite = [], favoriteSelect = false, handleStateProperty) => {

    let data = items;

    if (filter) {
        data = [...items].filter((el, i) => {
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
    }

    // if (favoriteSelect) {
    //     data = [...items].filter((el, i) => {
    //         return favorite.find((eFilter, iFilter) => {
    //             return el.guid === eFilter.productGuid;
    //         });
    //     });
    // }

    if (!AspNetCoreCookies) {
        data.length = 4;
    }
    return data;
};

const ProductInfo = (props) => {
    //console.dir(props);
    const {
        state: { AspNetCoreCookies = "", items = [], filter = [], favorite = [], favoriteSelect = false },
        urlControlAction = {}, stateChangeResult, getAllProductsFavorite, handleStateProperty } = props;

    // метод вызывает сообщение о добавляемом товаре
    const cardStickyAction = (q1 = {}, q2 = {}, q3 = {}) => {

        try {
            const { date = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", } = q1;
            const { fullEstimatedValue: priceMin = 0 } = q2 || {};
            const { fullEstimatedValue: priceMax = 0 } = q3 || {};

            console.log(q1, q2, q3);

            const coin = (el) => (el !== null || el !== "null") ? `${el} руб. ` : ` отсутствует `;

            const children = `${name}(${markingGoods}) - ${coin(price)} [мин:${priceMin}р-мак:${priceMax}р] / ${coin(priceWithoutDiscount)} (${_dateConverter(date)})`;

            return `<a href="${url}" target="_blank">${children}</a>`;
        } catch (error) {
            return `<a href="" target="_blank">${error}</a>`;
        }
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
                    html: String(cardStickyAction(json.items, json.itemsMinCost, json.itemsMaxCost)),
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
                <table className="col s12 striped highlight">
                    <thead id="tableTop">
                        <tr>
                            {
                                Object.keys(items.length > 0 ? items[0] : []).map((el, i) => {
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
                            dataFilter(items, filter, AspNetCoreCookies, favorite, favoriteSelect, handleStateProperty).map((item, index) => {
                                return (
                                    <tr key={item.id ? item.id : index}>
                                        {
                                            Object.keys(item).map((el, i) => {
                                                if (el.toLowerCase() === "id") {
                                                    return (<th key={item["id"] + el} name={`ID${item.id}`}>
                                                        <AllProductsFinder
                                                            item={item}
                                                            el={el}
                                                            urlControlAction={urlControlAction}
                                                        />
                                                        <div
                                                            className="hide"
                                                            id={"rootTitle"}
                                                            onDoubleClick={(e) => {
                                                                const tmp = document.getElementById("rootTitle");
                                                                tmp.classList.toggle("hide");
                                                                // e.target.closest("div").classList.toggle("hide");
                                                            }}
                                                        ></div>
                                                    </th>);
                                                } else if (el.toLowerCase() === "name") {
                                                    return (<td key={item["id"] + el}>
                                                        <a target="_blank" rel="noopener noreferrer" href={item["url"]}>{item[el]}</a>
                                                    </td>);
                                                } else if (el.toLowerCase() === "guid") {
                                                    return (
                                                        AspNetCoreCookies
                                                            ? (<td key={item["id"] + el}>
                                                                <ButtonFavorite
                                                                    stateChangeResult={stateChangeResult}
                                                                    getAllProductsFavorite={getAllProductsFavorite}
                                                                    urlControlAction={urlControlAction}
                                                                    favorite={favorite}
                                                                    item={item}
                                                                    itemGuid={item[el]}
                                                                    itemId={item.id}
                                                                    itemURL={item.url}
                                                                    markingGoods={item.markingGoods} />
                                                            </td>)
                                                            : null
                                                    );
                                                } else if (el.toLowerCase() === "date") {
                                                    return (<td key={item["id"] + el}>
                                                        {_dateConverter(item[el])}
                                                    </td>);
                                                } else if (el.toLowerCase() === "price") {
                                                    return (<td key={item["id"] + el} title={item[el]}>
                                                        {_moneyConverter(item[el])}
                                                    </td>);
                                                } else if (el.toLowerCase() === "pricewithoutdiscount") {
                                                    return (<td key={item["id"] + el} title={item[el]}>
                                                        {_moneyConverter(item[el])}
                                                    </td>);
                                                } else if (el.toLowerCase() === "url") {
                                                    return (<td key={item["id"] + el} >
                                                        <a className="btn-floating btn-small waves-effect waves-light red">
                                                            <i className="material-icons" onClick={e => dataUpdate(e)} data-update-url={item[el]}>update</i>
                                                        </a>
                                                    </td>);
                                                } else {
                                                    return (
                                                        <td key={item["id"] + el}>
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