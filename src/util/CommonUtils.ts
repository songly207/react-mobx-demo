import * as Api from './Api';
import * as StringUtils from './StringUtils';
/**
 * 根据身份证号获取性别
 */
export function getGenderFromPrcid(prcid: string): string {
    if (prcid.length >= 2) {
        try {
            let gender = parseInt(prcid.charAt(prcid.length - 2), 10);
            if (gender % 2 === 1) {
                return '男';
            } else {
                return '女';
            }
        } catch (error) {
            console.error('解析身份证性别异常.');
        }
        return '未知';
    } else {
        return '未知';
    }
}

export function selectDicByCodeList(codeList: string[], callback: any): void {
    let request = new Api.ApiBody();
    request.body = {
        codeList
    };
    let dictionary: { [key: string]: { [key: string]: string; }; };
    Api.performSingleApiBodyRequest(`/selectDicByCodeList`, request, (res) => {
        dictionary = res.body['dictionary'];
        callback(dictionary);
    });
}

/**
 * 格式化日期
 * format: yyyy-MM-dd hh:mm:ss
 */
export function dateFormat(date: Date | number, format: string = 'yyyy-MM-dd hh:mm:ss') {
    let _date: Date;
    if (typeof date === 'number') {
        _date = new Date(date as number);
    } else if (Object.prototype.toString.call(date) === '[object Date]') {
        _date = date;
    } else {
        _date = date;
    }
    if (!_date) {
        return '';
    }
    let o: any = {
        'M+': _date.getMonth() + 1, //month 
        'd+': _date.getDate(), //day 
        'h+': _date.getHours(), //hour 
        'm+': _date.getMinutes(), //minute 
        's+': _date.getSeconds(), //second 
        'q+': Math.floor((_date.getMonth() + 3) / 3), //quarter 
        'S': _date.getMilliseconds() //millisecond 
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return format;
}

/**
 * 获取URL中的query参数值
 */
export function getQueryValue(param: string) {
    let reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return decodeURI(r[2]);
    }
    return null; // 返回参数值
}

/**
 * 根据身份证获取出生日期
 */
export function getBirthDateFormPrcid(prcid: string) {
    if (prcid.length === 15) {
        let year = '19' + prcid.substr(6, 2);
        let month = prcid.substr(8, 2);
        let day = prcid.substr(10, 2);
        return `${year}年 ${month}月 ${day}日`;
    } else if (prcid.length === 18) {
        let year = prcid.substr(6, 4);
        let month = prcid.substr(10, 2);
        let day = prcid.substr(12, 2);
        return `${year}年 ${month}月 ${day}日`;
    } else {
        return '身份证号位数不对';
    }
}

/**
 * 根据身份证获取年龄
 */
export function getAgeFromPrcid(prcid: string) {
    let nowYear = new Date().getFullYear();
    if (prcid.length === 15) {
        let birthYear = '19' + prcid.substr(6, 2);
        let age = nowYear - parseInt(birthYear, 10);
        return age;
    } else if (prcid.length === 18) {
        let birthYear = prcid.substr(6, 4);
        let age = nowYear - parseInt(birthYear, 10);
        return age;
    } else {
        return -1;
    }
}

/**
 * json highlight
 */
export function syntaxHighlight(json: string | Object, newWindow = true):any {
    let data: string;
    if (typeof json !== 'string') {
        data = JSON.stringify(json, undefined, 2);
    }
    let result = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    result = result.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    let blob = new Blob([data], { type: 'text/plain' });
    let href = window.URL.createObjectURL(blob);
    let html = `
            <body>
                <head>
                    <meta charset="UTF-8">
                    <title>JSON</title>
                    <style>
                        body {
                            overflow: scroll;
                        }
                        pre {
                            outline: 1px solid #ccc;
                            padding: 5px;
                            margin: 5px;
                        }
                        .string {
                            color: green;
                        }
                        .number {
                            color: darkorange;
                        }
                        .boolean {
                            color: blue;
                        }
                        .null {
                            color: magenta;
                        }
                        .key {
                            color: red;
                        }
                    </style>
                </head>
                <div style="text-align:right;padding-right:10px;"><a href="${href}" download="debug.txt">保存</a></div>
                <pre>${result}</pre>
            <body>
        `;
    if (newWindow) {
        let w = window.open('', '', 'resizable=yes,scrollbars=yes,status=yes');
        w.document.write(html);
    } else {
        return html;
    }
}

export function parseOccurTime(time: string): string {
    if (time && 14 === time.length) {
        return `${time.substr(0, 4)}-${time.substr(4, 2)}-${time.substr(6, 2)} ${time.substr(8, 2)}:${time.substr(10, 2)}:${time.substr(12, 2)}`;
    } else {
        return '时间格式错误';
    }
}

/** 
 * 校验身份证,只做基本位数校验位校验不做行政区域合法性时间校验
 */
export function validateIdCard(id: string): boolean {
    let POWER = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let VERIFYCODE = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let regexp = /^(\d{15}|\d{18}|\d{17}(\d|X|x))$/;
    if (!regexp.test(id)) {
        return false;
    }
    if (15 === id.length) {
        return true;
    } else if (18 === id.length) {
        let sum = 0;
        for (let index = 0; index < id.length - 1; ++index) {
            sum += parseInt(id.charAt(index), 10) * POWER[index];
        }
        if (id.charAt(17) === VERIFYCODE[sum % 11]) {
            return true;
        }
    }
    return false;
}

/**
 * 金额格式化,输入单位:分,输出单位:元
 * format: 10,000,000.00
 */
export function formatMoney(money: string, def?: string): string {
    if (money) {
        let str = (parseInt(money, 10) / 100).toFixed(2) + '';
        let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',');// 取到整数部分
        let dot = str.substring(str.length, str.indexOf('.'));// 取到小数部分
        let ret = intSum + dot;
        return ret;
    } else {
        if (def) {
            return def;
        } else {
            return '0.00';
        }
    }
}

/**
 * 将格式化金额还原
 * format: 10,000,000.00
 */
export function moneyRestore(money: string): Number {
    if (money) {
        return parseInt(money.replace(/[^\d\.-]/g, ''), 10);
    }
    return 0;
}

/**
 * 数据字典
 */
export function getDictionaryView(dictionaryMap: any, encoding: string,
    key: string): string {
    if ($.isEmptyObject(dictionaryMap) ||
        $.isEmptyObject(dictionaryMap[encoding])) {
        return key;
    }
    let pageView = dictionaryMap[encoding][key];
    if (!pageView) {
        pageView = key;
    }
    return pageView;
}

/**
 * 返回productId中去除数字后的字符串
 * ZFD001 => ZFD
 * @param code 
 */
export function getProductFromId(code: string) {
    return code.match(/[a-zA-Z]/g).join("");
}
export function getProductNameByCode(code: string, productMap: any) {
    for (let index in productMap) {
        if (code.startsWith(index)) {
            return productMap[index];
        }
    }
    return '未知';
}
/**
 * @param id
 */
export function getAbcByIndex(id: number) {
    return id <= 26 ? String.fromCharCode(0X61 + id) : '超出范围';
}
/**
 * 计算时间差
 * @param dateStart 
 * @param dateEnd 
 */
export function getTimeDiffDesc(dateStart: Date | number, dateEnd: Date | number) {
    let timeDiffDesc = '';
    let startNumber = 0;
    let endNumber = 0;

    if (typeof dateStart === 'number') {
        startNumber = dateStart;
    } else {
        startNumber = dateStart.getTime();
    }

    if (typeof dateEnd === 'number') {
        endNumber = dateEnd;
    } else {
        endNumber = dateEnd.getTime();
    }
    //时间差的毫秒数
    var milliSeconds = endNumber - startNumber;

    //计算出相差天数
    var days = Math.floor(milliSeconds / (24 * 3600 * 1000));
    if (days > 0) {
        timeDiffDesc += days + '天';
    }

    //计算出小时数
    var leave1 = milliSeconds % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数

    var hours = Math.floor(leave1 / (3600 * 1000));
    if (days > 0 || hours > 0) {
        timeDiffDesc += hours + '小时';
    }

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);       //计算小时数后剩余的毫秒数

    var minutes = Math.floor(leave2 / (60 * 1000));
    if (days > 0 || hours > 0 || minutes > 0) {
        timeDiffDesc += minutes + '分钟';
    }

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数

    var seconds = Math.round(leave3 / 1000);
    timeDiffDesc += seconds + '秒';

    return timeDiffDesc;
}

export function getSortNumbers(str: string): string {
    if (StringUtils.isEmpty(str)) {
        return '';
    }
    let regexp = /[0-9]+/g;
    return str.match(regexp).map(e => {return parseInt(e)}).sort((a, b) => { return a - b }).join(',');
}