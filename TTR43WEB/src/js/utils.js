class UserException {
    constructor(message) {
        this.message = message;
        this.name = "Исключение, определенное пользователем";
    }
}

/**
 * Ajax function, only json return
 * @param {string} url адрес контроллера
 * @param {object} object содержит идентификатор language языка
 * @param {any} method POST/GET
 * @returns {Promise} async
 */
export const AjaxPOSTAsync = (url, object = null, method = "POST") => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        switch (method) {
            case "POST":
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.responseType = "json";
                break;
            case "GET":
                xhr.setRequestHeader("Content-Type", "text/html;charset=utf-8");
                xhr.responseType = "";
                break;
            default:
                throw new UserException(`${method} is unknown`);
        }
        xhr.addEventListener("load", (event) => {
            const that = xhr || event.target;
            if (that.status >= 200 && that.status < 300 || that.status === 304) {
                switch (method) {
                    case "POST":
                        if (typeof (that.response) === "string") {
                            resolve(JSON.parse(that.responseText));
                        }
                        if (typeof (that.response) === "object") {
                            resolve(that.response);
                        }
                        break;
                    case "GET":
                        resolve(that.response);
                        break;
                    default:
                        throw new UserException(`${method} is unknown`);
                }
            } else if (that.status === 500) {
                //window.location = url;
                console.dir(that);
            } else {
                console.dir(that);
            }
        });
        xhr.addEventListener("error", (event) => {
            const that = xhr || event.target;
            reject(that.statusText);
        });
        if (object && method === "POST") {
            const tmp = JSON.stringify(object);
            xhr.send(tmp);
        } else {
            xhr.send();
        }
    });
};


export const createElementWithAttr = (object, options) => {
    const element = window.document.createElement(object);
    for (const key in options) {
        switch (key) {
            case "textContent":
                element.textContent = options[key];
                break;
            case "readonly":
                if (typeof options[key] === "boolean") {
                    element.readOnly = options[key];
                } else {
                    console.error(options[key]);
                }
                break;
            default:
                element.setAttribute(key, options[key]);
                break;
        }
    }
    return element;
};

export const getBrowserType = () => {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3576.0 Safari/537.36"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.17 Safari/537.36"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763"
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0"
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko"
    // "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    const _userAgent = navigator.userAgent;
    const br = {
        "Chrome": "Chrome",
        "Edge": "Edge",
        "Firefox": "Firefox",
        ".NET CLR": "Internet Explorer 11",
    };
    const nobr = {
        "MSIE 10.0": "Internet Explorer 10",
        "MSIE 9.0": "Internet Explorer 9",
        "MSIE 8.0": "Internet Explorer 8",
        "MSIE 7.0": "Internet Explorer 7"
    };
    let thisBrow = "Unknown";
    for (const keys in br) {
        if (br.hasOwnProperty(keys)) {
            if (_userAgent.includes(keys)) {
                thisBrow = br[keys];
                for (const key in nobr) {
                    if (_userAgent.includes(key)) {
                        thisBrow = nobr[key];
                    }
                }

            }
        }
    }

    return thisBrow;
};

export const genTable = (data, title = "", className = "striped highlight") => {

    const dateConverter = (date) => {
        try {
            const newDate = (new Date(date)).toLocaleString("RU-be");
            console.log(newDate);
            return newDate;
        } catch (error) {
            return date || Date.now;
        }
    };

    const TableRowHeader = (datas) => {
        let tmpString = ``;

        for (const item in datas) {
            if (item !== "guid" && item !== "url") {
                tmpString += `<th data-key=${item}>${item.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</th>`;
            }
        }
        return tmpString;
    };

    const TableRowData = (datas, id = "ID") => {
        try {
            let tmpString = ``;
            console.dir(datas);
            for (const item in datas) {
                if (item !== "guid" && item !== "url") {
                    if (item.toLowerCase() === "date") {
                        tmpString += `<td>${dateConverter(datas[item])}</td>`;
                    }
                    else if (item.toLowerCase() === "id") {
                        tmpString += `<th>${datas.id}</th>`;
                    }
                    else if (item.toLowerCase() === "name") {
                        tmpString += `<td><a target="_blank" href="${datas.url}">${String(datas[item])}</a></td>`;
                    }
                    else {
                        tmpString += `<td>${String(datas[item]).replace("null", "-")}</td>`;
                    }
                }
            }
            return `<tr>${tmpString}</tr>`;
        } catch (error) {
            console.error(error);
        }
    };

    const genTable = (el) => {
        return (
            `<div>
            ${title ? "<summary>${title}</summary>" : ""}
            <table class="${className}">
                <caption>
                    <p>${title.replace(new RegExp("_", "g"), " ")}</p>
                </caption>
                <thead>
                    <tr>${TableRowHeader(data[0])}</tr>
                </thead>
                <tbody>
                    ${el}
                </tbody>
            </table>
        </div>`
        );
    };

    let rootLogText = "";
    Array.from(data).map((items) => {
        rootLogText += TableRowData(items);
    });


    return genTable(rootLogText);
};

(() => {
    try {
        const tmp = Array.from(document.querySelectorAll("a.to_favorite.fa.fa-heart")).map(e => e.getAttribute("data-product-id"));
        const div = document.getElementsByTagName("body")[0].appendChild(document.createElement("div"));
        const tmpURL = [];
        tmp.map(e => {
            const a = document.createElement("p");
            const tmp = `https://${document.domain}/catalog/item_${e.replace(/,/g, "")}.html`;
            a.textContent = tmp;
            div.appendChild(a);
            tmpURL.push(tmp);
        });

        const data = tmpURL.join("; ");
        console.dir(data);

    } catch (error) {
        console.error(error);
    }
});
