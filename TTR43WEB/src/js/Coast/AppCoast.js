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
        event.target.parentElement.querySelector("table").classList.toggle("hide");
    }
    stateChangeResult = (object) => {
        this.setState((state, props) => {
            return { dataResult: [...state.dataResult, object] };
        });
    }
    render() {
        const { dataResult = [], error, isLoaded } = this.state;
        //const a = dataResult.filter((e, i) => !e.url);
        return (
            <React.Fragment>
                <div className="input-field col s12">
                    <CoastTextareaUrl
                        stateChangeResult={this.stateChangeResult}
                        urlData={urlControlActionGetCoastAsync}
                    />
                </div>
                <div className="col s12"><p onClick={(e) => this.onDetails(e)}>+</p>
                    <table className="striped highlight hide" data-src={this.props.name}>
                        <thead>
                            <tr>
                                {
                                    Object.keys(dataResult[0] || {}).map((item, i) =>
                                        (<th key={i}>
                                            {
                                                item
                                                    .replace(/([A-Z])/g, " $1")
                                                    .replace(/^./,
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
                                [...dataResult].map((item, indexes) => {
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