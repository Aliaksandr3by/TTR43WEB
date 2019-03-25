
import PropTypes from "prop-types";
import React from "react";
import M from "materialize-css";

export const Navigate = props => {
    return (
        <React.Fragment>
            <nav>
                <div className="nav-wrapper">
                    <a className="brand-logo">Index</a>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="right hide-on-med-and-down">
                        <li><a >gipermall</a></li>
                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                <li><a>gipermall</a></li>
            </ul>
        </React.Fragment>
    );
};

Navigate.propTypes = {

};