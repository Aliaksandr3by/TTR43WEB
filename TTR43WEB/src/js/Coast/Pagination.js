import PropTypes from "prop-types";
import React, { Component } from "react";
import PageSizeSelector from "./PageSizeSelector";
import PageList from "./PageList";

const Pagination = props => {

    const { valueDefault, pageSize, totalPages, productPage } = props.state;
    const { handleStateResultObject } = props;

    return (
        <div>
            <PageSizeSelector
                productPage={Number(productPage)}
                valueDefault={valueDefault}
                pageSize={Number(pageSize)}
                handleStateResultObject={handleStateResultObject}
            >Число элементов на листе</PageSizeSelector>
            <PageList
                productPage={Number(productPage)}
                pageSize={Number(pageSize)}
                totalPages={Number(totalPages)}
                handleStateResultObject={handleStateResultObject}
            ></PageList>
        </div >
    );
};

Pagination.propTypes = {
    state: PropTypes.object.isRequired,
    handleStateResultObject: PropTypes.func.isRequired,
};

export default Pagination;
