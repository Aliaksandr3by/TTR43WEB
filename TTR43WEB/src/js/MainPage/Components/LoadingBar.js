
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const LoadingBar = () => {
    return (
        <div className="row" >
            <div className="loadingBar">
                <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            </div>
        </div>
    );
};

LoadingBar.propTypes = {

};

export default LoadingBar;