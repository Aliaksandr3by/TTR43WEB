import PropTypes from "prop-types";
import React, { Component } from "react";



class CoastGoods extends Component {
    static propTypes = {
        dataResult: PropTypes.object.isRequired,
        handleStateResult: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
    }
    render() {
        let data = this.props.dataResult;
        return (
            <tr>
                {
                    Object.keys(data).map((item, i) =>
                        (<td key={i}>
                            {data[item]}
                        </td>)
                    )
                }
            </tr>
        );
    }
}

export default CoastGoods;