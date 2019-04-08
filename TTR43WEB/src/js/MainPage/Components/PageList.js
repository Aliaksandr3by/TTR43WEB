
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const onSelectPage = (event, newProductPage, totalPages, handleState) => { //номер страницы

    let _productPage = Number(newProductPage);

    if (_productPage < 0) {
        _productPage = totalPages - 1;
    } else if (_productPage >= totalPages) {
        _productPage = 0;
    }

    handleState({
        "productPage": _productPage
    });

    window.localStorage.setItem("productPage", _productPage);

    document.documentElement.scrollTop = 0;
};

const PageList = props => {

    const { state: { totalPages, productPage, pageSize }, handlePageOptions } = props;

    /// Метод устанавливает класс active
    const active = (productPage, i) => productPage === i ? "active pulse" : "waves-effect";
    /// Метод устанавливает класс disabled для неактивных элементов выбранной страницы
    const disabled = (productPage, i) => productPage === i ? "disabled" : "";

    const href = (pageSize, i, productPage) => productPage === i ? `/Gipermall/Index/#/Page${i}/Size${pageSize}` : `/Gipermall/Index/#/Page${i}/Size${pageSize}`;

    return (
        <div className="center-align">
            <ul className="pagination">
                <li className={disabled(productPage, 0)}>
                    <a href={href(pageSize, productPage - 1, productPage)} onClick={e => onSelectPage(e, productPage - 1, totalPages, handlePageOptions)}>
                        <i className="material-icons">chevron_left</i>
                    </a>
                </li>
                {
                    [...Array(totalPages)].map((item, i) => {
                        return (
                            <li key={i} className={`${active(productPage, i)} ${disabled(productPage, i)}`}>
                                <a href={href(pageSize, i, productPage)} onClick={e => onSelectPage(e, i, totalPages, handlePageOptions)}>{i}</a>
                            </li>
                        );
                    })
                }
                <li className={disabled(productPage, totalPages - 1)}>
                    <a href={href(pageSize, productPage + 1, productPage)} onClick={e => onSelectPage(e, productPage + 1, totalPages, handlePageOptions)}>
                        <i className="material-icons" >chevron_right</i>
                    </a>
                </li>
            </ul>
        </div>
    );
};
PageList.propTypes = {
    handlePageOptions: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
};

export default PageList;