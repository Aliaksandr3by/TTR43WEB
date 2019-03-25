import PropTypes from "prop-types";
import React from "react";
import M from "materialize-css";


export const ProductInfo = (props) => {

    const { state: { items = [], name = "" }, urlControlAction = {} } = props;

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

    const cardStickyAction = ({ date = "", id = "", markingGoods = "", name = "", price = "", priceWithoutDiscount = "", url = "", }) => {
        return `${name} - ${price}руб. - ${priceWithoutDiscount}руб.`;
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
                    html: cardStickyAction(json.items),
                    classes: "rounded"
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <React.Fragment>
            <table className="col s12 striped highlight" data-src={name}>
                <caption><p>{name}</p></caption>
                <thead id="tableTop">
                    <tr>
                        {
                            Object.entries(items[0] = {}).map(([el, i]) => {
                                if (el.toLowerCase() === "url") {
                                    return (<th key={i} >
                                        UPDATE
                                        </th>);
                                } else {
                                    return (<th key={i} >
                                        {_replacer(el)}
                                    </th>);
                                }
                            }
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from(items).map((item, index) => {
                            return (
                                <tr key={index}>
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
            </table>
        </React.Fragment>
    );
};

ProductInfo.propTypes = {
    urlControlAction: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
};

export default ProductInfo;