import PropTypes from "prop-types";
import React, { Component } from "react";
import Table from "./Table";

class CreateTableAll extends Component {
    static propTypes = {
        dataContex: PropTypes.object.isRequired,
    };
    static defaultProps = {
        dataContex: {}
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
    onGet(event) {
        console.dir(this.state);
    }
    render() {
        const data = this.state.dataContex;
        return (
            <React.Fragment >
                <button className="btn-floating" onClick={(e) => this.onGet(e)}>getState</button>
                {
                    Object.keys(data).map((item, i) => {
                        return (<Table key={i} name={item} stateChange={this.handleChangeState} dataContex={data[item]}/>);
                    })
                }
            </React.Fragment>
        );
    }
}

export default CreateTableAll;