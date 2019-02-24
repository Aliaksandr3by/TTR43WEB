import PropTypes from "prop-types";
import React, { Component } from "react";
import Table from "./Table";

const CreateTableAll = (props) => {
    const data = props.data;
    return (
        <div>
            {
                Object.keys(data).map((item, i) => {
                    return (<Table key={i} name={item} datum={data[item]} className="striped highlight" />);
                })
            }
        </div>
    );
};

CreateTableAll.prototype = {
    datas: PropTypes.object
};
CreateTableAll.defaultProps = {
    datas: {}
};

export default CreateTableAll;