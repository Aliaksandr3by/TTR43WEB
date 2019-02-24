import PropTypes from "prop-types";
import React, { Component } from "react";
import Table from "./Table";

const CreateTableAll = ({tableData}) => {
    return (
        <>
            {
                Object.keys(tableData).map((item, i) => {
                    return (<Table key={i} name={item} datum={tableData[item]} className="striped highlight hide" />);
                })
            }
        </>
    );
};

export default CreateTableAll;