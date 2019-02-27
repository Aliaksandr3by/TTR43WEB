import PropTypes from "prop-types";
import React, { Component } from "react";

class CoastGoodsResult extends Component {
    static propTypes = {
        dataResult: PropTypes.object.isRequired,
    };
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.dataResult;
        return (
            <ul>
                {
                    Object.keys(data).map((item, i) => {
                        return (<li key={i}>{item} {data[item]}
                        </li>);
                    })
                }
            </ul>
        );
    }
}

export default CoastGoodsResult;