
import PropTypes from "prop-types";
import React, { Component } from "react";
import M from "materialize-css";

const LoadingBar = ({ children }) => {
    return (
        <React.Fragment>
            <p>{children}</p>
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div><div className="gap-patch">
                        <div className="circle"></div>
                    </div><div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

LoadingBar.propTypes = {
    children: PropTypes.string,
};

export default LoadingBar;