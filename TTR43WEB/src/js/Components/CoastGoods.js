import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastGoodsResult from "./CoastGoodsResult";

class CoastGoods extends Component {
    static propTypes = {
        dataContex: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            dataContex: props.dataContex,
            dataChange: {},
        };
    }
    handleChangeState = (object) => {
        this.setState((state, props) => {
            return { dataChange: Object.assign(state.dataChange, object)};
        });
    }
    render() {
        const data = this.state.dataContex;
        return (
            <React.Fragment>
                {
                    Object.keys(data).map((item, i) => {
                        return (<CoastGoodsResult key={i} name={item} stateChange={this.handleChangeState} dataContex={data[item]}/>);
                    })
                }
            </React.Fragment>
        );
    }
}

export default CoastGoods;