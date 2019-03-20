
import PropTypes from "prop-types";
import React from "react";

const PageList = props => {

    const { handleStateResultObject } = props;
    const { totalPages, productPage, pageSize } = props.state;

    const active = (productPage, i) => productPage === i ? "active pulse" : "waves-effect";

    const disabled = (productPage, i) => productPage === i ? "disabled" : "waves-effect";

    const href = (pageSize, i) => `#/Page${i}/Size${pageSize}`;

    const onSelectPage = (event, _productPage, _pageSize, _totalPages) => { //номер страницы
        const totalPages = Number(_totalPages);
        const pageSize = Number(_pageSize);
        let productPage = Number(_productPage);
        if (productPage < 0) {
            productPage = totalPages - 1;
        } else if (productPage >= totalPages) {
            productPage = 0;
        }
        
        handleStateResultObject({
            "pageSize": pageSize,
            "productPage": productPage,
        });
        
        window.localStorage.setItem("productPage", productPage);

        document.documentElement.scrollTop = 0;
    };

    return (
        <div className="center-align">
            <ul className="pagination">
                <li className={disabled(productPage, 0)}>
                    <a href={href(pageSize, productPage - 1)} onClick={e => onSelectPage(e, productPage - 1, pageSize, totalPages)}>
                        <i className="material-icons">chevron_left</i>
                    </a>
                </li>
                {
                    [...Array(totalPages)].map((item, i) => {
                        return (
                            <li key={i} className={active(productPage, i)}>
                                <a href={href(pageSize, i)} onClick={e => onSelectPage(e, i, pageSize, totalPages)}>{i}</a>
                            </li>
                        );
                    })
                }
                <li className={disabled(productPage, totalPages)}>
                    <a href={href(pageSize, productPage + 1)} onClick={e => onSelectPage(e, productPage + 1, pageSize, totalPages)}>
                        <i className="material-icons" >chevron_right</i>
                    </a>
                </li>
            </ul>
        </div>
    );
};
PageList.propTypes = {
    handleStateResultObject: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
};

export default PageList;