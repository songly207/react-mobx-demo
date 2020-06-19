/**
 * @file StringUtils
 */

/**
 * isEmpty
 * @param {string} val 字符串

 */
export function isEmpty(val: string | null): boolean {
    if (null === val || undefined === val) {
        return true;
    }
    if (typeof val === 'string') {
        return val.length < 1;
    }
    return false;
}

/**
 * isNotEmpty
 * @param {string} val 字符串

 */
export function isNotEmpty(val: string): boolean {
    return !isEmpty(val);
}

/**
 * 该val是否可用，排除了-9999、空数组、风控报错的情况
 * 建议判断searchdb数据是否有值时用这个方法
 * @param {string} val 字符串
 */
export function isAvailable(val: string): boolean {
    if (isEmpty(val)) {
        return false;
    } else {
        return !(val === '-9999' || val === "[]" || val === 'VariableErrorAndDefaultValueNotSet');
    }
}

/**
 * 处理html转义，将特殊符号的转义转回
 * @param {string} val 字符串
 */
export function htmlDecode(val: string): string | null {
    if (!isAvailable(val)) {
        return '';
    }
    var div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent;
};

/**
 * 判断是否为数组
 * @param object
 */
export function isArray(object: any) {
    return object && typeof object === 'object' &&
        Array == object.constructor;
}

export function isArrayHaveKey(arr: any, key: any) {
    if (arr.indexOf && typeof (arr.indexOf) == 'function') {
        let index = arr.indexOf(key);
        if (index >= 0) {
            return true;
        }
    }
    return false;
}

export function removeKey(arr: any[], key: any) {
    let rtnArr: any[] = [];
    arr.forEach(element => {
        if (element !== key) {
            rtnArr.push(element);
        }
    });
    return rtnArr;
}

export function handleArrKey(key: string, obj: any): string | null {
    let rtnVal: string | null = '';
    let keyArr = key.split('|');
    keyArr.forEach(e => {
        if (obj[e]) {
            rtnVal = htmlDecode(obj[e]);
        }
    });
    return rtnVal;
}