
import PropTypes from "prop-types";
import React from "react";

export const PageList = props => {
    const active = (productPage, i) => productPage === i ? "active" : "waves-effect";
    const href = (productPage, pageSize) => `#/Page${productPage + 1}/Size${pageSize}`;
    return (
        <ul className="pagination">
            {
                props.items.map((item, i) => {
                    return (
                        <li
                            key={i}
                            className={active(props.productPage, i)}>
                            <a
                                href={href(props.productPage, props.pageSize)}
                                onClick={props.onSelect}>{item.data}
                            </a>
                        </li>
                    );
                })
            }
        </ul>
    );
};

PageList.propTypes = {
    items: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    productPage: PropTypes.number.isRequired,
};