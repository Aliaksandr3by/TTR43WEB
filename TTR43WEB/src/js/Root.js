
import PropTypes from "prop-types";
import React from "react";
import { CookiesProvider } from "react-cookie";

import App from "./App";

const Root = (props) => {
    const {urlControlAction = {}} = props;
    return (
        // https://www.npmjs.com/package/react-cookie
        <CookiesProvider>
            <App urlControlAction={urlControlAction} />
        </CookiesProvider>
    );
};

Root.propTypes = {
    urlControlAction: PropTypes.object.isRequired,
};

export default Root;