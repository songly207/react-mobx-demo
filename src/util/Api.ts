
/**
 * 信审系统API
 */

export class ResponseCode {
    static DEFAULT = '00000';
    static OK = '10000';
    static INVALID = '20000';
    static ERROR = '90000';
}

export class ApiBody {
    path: string;
    code: string;
    msg: string;
    body: any = {};
    extra: any;
}

export class ReqRes {
    meta: Object;
    apis: ApiBody[];
}

/**
 * 请求多个API
 *
 * @param req A complete request body
 * @param callBack
 */
export function performRequest(req: ReqRes, callBack: (res: ReqRes) => void, url = '/apsmis/api') {
    let ajax = $.ajax({
        type: 'post',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(req),
        error: function (data: any) {
            if (data.responseJSON === undefined || data.responseJSON.msg === undefined) {
                toastr.error('请求出错');
            } else {
                toastr.error(data.responseJSON.msg);
            }
        },
        success: function (data: ReqRes) {
            callBack(data);
        }
    });
    return ajax;
}

/**
 * 只有单个API时的 @see performRequest 的简化 @note 后台接收多个ApiBody
 *
 * @param req A ApiBody for request
 * @param callBack
 */
export function performRequestForSingleApi(req: ApiBody, callBack: (res: ApiBody) => void) {
    let reqRes = new ReqRes();
    reqRes.apis = [req];
    performRequest(reqRes, (res) => {
        callBack(res.apis[0]);
    });
}

/**
 * 请求单个ApiBody, @note: 此时后台接口只接收一个ApiBody
 */
export function performSingleApiBodyRequest(url: string, req: any, callBackOk: (res: ApiBody) => void, callBackError?: (res?: ApiBody) => void) {
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(req),
        success: function (data: ApiBody) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBackOk(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
                if (callBackError) {
                    callBackError(data);
                }
            }
        },
        error: function (data, textStatus) {
            if (callBackError) {
                callBackError();
            }
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                if (textStatus === 'abort') {
                    return;
                }
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

/**
 * 带参get请求
 */
export function GetRequest(url: string, req: any, callBack: (res: any) => void) {
    let ajax = $.getJSON(url, req);
    return ajax;
}
/**
 * 无参GET请求, @note: 此时后台接口只接收一个ApiBody
 */
export function performGetRequest(url: string, callBack: (res: any) => void, errCallBack?: (res: any) => void) {
    let ajax = $.ajax({
        type: 'GET',
        url: url,
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.body.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
                errCallBack&&errCallBack(data);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

/**
 * 无参GET请求, @note: 此时后台接口只接收一个ApiBody
 */
export function performGetRequestSyn(url: string, callBack: (res: any) => void) {
    let ajax = $.ajax({
        type: 'GET',
        url: url,
        async: false,
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.body.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

/**
 * 自定义请求参数格式
 */
export function performSingleAnyRequest(url: string, req: any, callBack: (res: any) => void) {
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(req),
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

/**
 * 自定义请求参数格式
 */
export function performSingleAnyRequestSyn(url: string, req: any, callBack: (res: any) => void) {
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(req),
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

export function performSingleFormRequest(url: string, req: any, callBack: (res: any) => void) {
   let ajax = $.ajax({
        type: 'POST',
        url: url,
        data: req,
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

export function performSingleFormRequestSyn(url: string, req: any, callBack: (res: any) => void) {
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        data: req,
        async: false,
        success: function (data: any) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}

/**
 * 请求单个ApiBody, @note: 此时后台接口只接收一个ApiBody
 * 同步
 */
export function performSingleApiBodyRequestSyn(url: string, req: ApiBody, callBack: (res: ApiBody|any) => void, errCallback?: (res?: ApiBody|any) => void) {
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(req),
        success: function (data: ApiBody) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg ||  '网络失败');
                errCallback && errCallback(data);
            } catch (error) {
                toastr.error(data.responseText || '网络失败');
            }
        }
    });
    return ajax;
}

/**
 * 无参请求单个ApiBody, @note: 此时后台接口只接收一个ApiBody
 */
export function performSingleApiBody(url: string, callBack: (res: ApiBody) => void) {
    let req = new ApiBody();
    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(req),
        contentType: 'application/json',
        success: function (data: ApiBody) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
}
/**
 * 无参请求单个ApiBody, @note: 此时后台接口只接收一个ApiBody
 */
export function performSingleApiBodySyn(url: string, callBack: (res: ApiBody) => void) {
    let req = new ApiBody();
    let ajax = $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(req),
        contentType: 'application/json',
        async: false,
        success: function (data: ApiBody) {
            if (ResponseCode.OK === data.code || ResponseCode.DEFAULT === data.code) {
                callBack(data);
            } else {
                toastr.error(data.msg || 'Nothing returned.');
            }
        },
        error: function (data) {
            try {
                let response = JSON.parse(data.responseText);
                toastr.error(response.msg);
            } catch (error) {
                toastr.error(data.responseText);
            }
        }
    });
    return ajax;
}