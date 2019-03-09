import PropTypes from "prop-types";
import React, { Component } from "react";
import CoastTextareaUrl from "./CoastTextareaUrl";

class AppCoast extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            dataResult: [],
            error: null,
            isLoaded: false,
        };
    }
    onDetails(event) {
        const that = event.target;
        that.parentElement.querySelector("table").classList.toggle("hide");
    }
    handleStateResult = (object) => {
        this.setState((state, props) => {
            return { dataResult: [...state.dataResult, object] };
        });
    }
    render() {
        const data = this.state.dataResult;
        const dataHeader = this.state.dataResult[0] || {};
        const { dataResult, error, isLoaded } = this.state;

        return (
            <React.Fragment>
                <CoastTextareaUrl stateChangeResult={this.handleStateResult} urlData={urlControlActionGetCoastAsync} />
                <div className="card"><p onClick={(e) => this.onDetails(e)}>+</p>
                    <table className="striped highlight responsive-table hide" data-src={this.props.name}>
                        <thead>
                            <tr>
                                {
                                    Object.keys(dataHeader).map((item, i) =>
                                        (<th key={i}>
                                            {
                                                item.replace(/([A-Z])/g, " $1").replace(/^./,
                                                    (str) => {
                                                        return str.toUpperCase();
                                                    })
                                            }
                                        </th>)
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array.from(data).map((item, indexes) => {
                                    return (
                                        <tr key={indexes}>
                                            {
                                                Object.keys(item).map((el, i) => {
                                                    if (el.toLowerCase() === "id") {
                                                        return (<th key={i} name={`ID${item.id}`}>
                                                            {item[el]}
                                                        </th>);
                                                    } else if (el.toLowerCase() === "name") {
                                                        return (<td key={i}>
                                                            <a href={item["url"]}>{item[el]}</a>
                                                        </td>);
                                                    } else {
                                                        return (<td key={i}>
                                                            {item[el]}
                                                        </td>);
                                                    }
                                                })
                                            }
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default AppCoast;