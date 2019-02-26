import PropTypes from "prop-types";
import React, { Component } from "react";

class CoastGoodsResult extends Component {
    static propTypes = {
        dataContex: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            dataContex: props.dataContex,
            dataChange: {},
        };
    }

    render() {
        const data = this.state.dataContex;
        return (
            <ul>
                {
                    Object.keys(data).map((item, i) => {
                        return (<li key={i}>{item} {data[item]}</li>);
                    })
                }
            </ul>
        );
    }
}

export default CoastGoodsResult;