
import PropTypes from "prop-types";
import React from "react";

export const PageList = props => {
    const active = (productPage, i) => productPage === i ? "active pulse" : "waves-effect";
    const disabled = (productPage, i) => productPage === i ? "disabled" : "waves-effect";
    const href = (pageSize, i) => `#/Page${i}/Size${pageSize}`;
    return (
        <div className="center-align">
            <ul className="pagination">
                <li className={disabled(props.productPage, 0)}>
                    <a href={href(props.pageSize, props.productPage - 1)} onClick={e => props.onSelectPage(e, props.productPage - 1)}>
                        <i className="material-icons">chevron_left</i>
                    </a>
                </li>
                {
                    [...Array(props.totalPages)].map((item, i) => {
                        return (
                            <li key={i} className={active(props.productPage, i)}>
                                <a href={href(props.pageSize, i)} onClick={e => props.onSelectPage(e, i)}>{i}</a>
                            </li>
                        );
                    })
                }
                <li className={disabled(props.productPage, props.totalPages)}>
                    <a href={href(props.pageSize, props.productPage + 1)} onClick={e => props.onSelectPage(e, props.productPage + 1)}>
                        <i className="material-icons" >chevron_right</i>
                    </a>
                </li>
            </ul>
        </div>
    );
};

PageList.propTypes = {
    onSelectPage: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    productPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};