import React from "react";
import PropTypes from "prop-types";

class CreateSelect extends React.Component {
    static propTypes = {
        handleStateResultObject: PropTypes.func.isRequired,
        createPaging: PropTypes.func.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            pageSize: this.props.pageSize || window.localStorage.getItem("pageSize"),
            valueDefault: this.props.valueDefault,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {

    }
    handleChange(event) {
        this.setState({
            pageSize: Number(event.target.value)
        });
        window.localStorage.setItem("pageSize", Number(event.target.value));
        const data = {
            "pageSize": Number(event.target.value) || 10
        };
        const init = {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        };
        fetch(urlControlActionPagination, init)
            .then(
                res => res.json()
            )
            .then(
                (result) => {
                    this.setState({
                        valueDefault: result.valueDefault,
                        totalPages: result.totalPages,
                        items: this.props.createPaging(result.totalPages, result.pageSize),
                    });
                    this.props.handleStateResultObject({ items: this.state.items });
                },
                (error) => {
                    this.setState({
                        error
                    });
                    console.error(error);
                }
            );
    }
    render() {
        const { error, isLoaded, valueDefault } = this.state;
        return (
            <React.Fragment>
                <select className="browser-default" value={this.state.pageSize} onChange={this.handleChange}>
                    {
                        valueDefault.map((item, key) => {
                            return (
                                <option key={key} value={item}>{item}</option>
                            );
                        })
                    }
                </select>
            </React.Fragment>
        );
    }
}

export default CreateSelect;