
import PropTypes from "prop-types";
import React from "react";

export const PageList = props => {

    const active = (productPage, i) => productPage === i ? "active" : "waves-effect";
    const href = (productPage, pageSize) => `#/Page${productPage + 1}/Size${pageSize}`;

    let li = [];
    for (let i = 0; i < props.totalPages; i++) {
        li[i] = {
            data: i + 1
        };
    }
    li.unshift({
        href: ``,
        data: <i className="material-icons">chevron_left</i>
    });
    li.push({
        href: ``,
        data: <i className="material-icons">chevron_right</i>
    });

    return (
        <ul className="pagination">
            {
                li.map((item, i) => {
                    return (
                        <li
                            key={i}
                            className={active(props.productPage, i)}>
                            <a
                                href={href(props.productPage, props.pageSize)}
                                onClick={props.onSelectPage}
                            >{item.data}</a>
                        </li>
                    );
                })
            }
        </ul>
    );
};

PageList.propTypes = {
    onSelectPage: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    productPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};