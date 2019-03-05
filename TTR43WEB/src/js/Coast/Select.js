import React from "react";
import PropTypes from "prop-types";

class CreateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResult: [10, 15, 20, 25, 30],
        };
    }
    getData(pageSize) {
        try {
            AjaxPOSTAsync(urlControlActionPagination, { "pageSize": pageSize }, "POST")
                .then((datum) => {
                    this.handleStateResultObject(datum);
                    console.dir(this.state);
                }).catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    }
    onChange(e) {
        this.props.handleStatePageSize({ pageSize: Number(e.target.value) });
    }
    render() {
        const data = this.state.dataResult;
        return (
            <React.Fragment>
                <label>Browser Select</label>
                <select className="browser-default" onChange={(e) => this.onChange(e)}>
                    {
                        data.map((item, key) => {
                            return (
                                <option key={key} defaultValue={item}>{item}</option>
                            );
                        })
                    }
                </select>
            </React.Fragment>
        );
    }
}

export default CreateSelect;