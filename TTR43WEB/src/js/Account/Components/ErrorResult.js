
import PropTypes from "prop-types";
import React from "react";

const ErrorResult = ({ errorUser = [] }) => {
    return (
        <ul>
            {
                errorUser.length > 0
                    ? errorUser.map((e, i) => {
                        return (<li key={i}>{`${i} ${e}`}</li>);
                    })
                    : null
            }
        </ul>
    );
};

ErrorResult.propTypes = {
    errorUser: PropTypes.array.isRequired,
};

export default ErrorResult;