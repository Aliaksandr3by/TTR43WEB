import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastGoodsResult from "./CoastGoodsResult";
import CoastTextareaUrl from "./CoastTextareaUrl";

class CoastGoods extends Component {
    static propTypes = {
        dataContex: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataContex: props.dataContex
        };
    }
    render() {
        const data = this.state.dataContex;
        return (
            <React.Fragment>
                {
                    Object.keys(data).map((item, i) => {
                        return (<CoastGoodsResult key={i} name={item} dataContex={data[item]} />);
                    })
                }
            </React.Fragment>
        );
    }
}

export default CoastGoods;