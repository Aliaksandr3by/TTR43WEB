
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const LoadingBar = ({ children }) => {
    return (
        <div className="row" >
            <p>{children}</p>
        </div>
    );
};

LoadingBar.propTypes = {
    children: PropTypes.string,
};

export default LoadingBar;