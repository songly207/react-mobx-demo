export const isNull: { [key: string]: string; } = {
    '0': '空',
    '1': '非空',
};

export const status: { [key: number]: string } = {
    0: '草稿',
    1: '待审核',
    2: '通过',
    3: '拒绝'
}

export const dataLevel: { [key: string]: string } = {
    '15': '私密',
    '14': '绝密',
    '13': '机密',
    '12': '保密',
    '11': '公开',
}
export const dataImportanceLevel: { [key: string]: string } = {
    'P0': 'P0：非常重要，数据问题<=1次/月，需在24h内修复',
    'P1': 'P1：较重要，数据问题<=2次/月，需在48h内修复',
    'P2': 'P2：重要，数据问题<=3次/月，需在72h内修复',
    'P3': 'P3：一般，数据问题<=3次/月，需在一周内修复',
}
export const updateRate: { [key: string]: string } = {
    'untime': '不定时',
    'minute': '分钟',
    'day': '天',
    'week': '周',
    'month': '月',
}
export const dataUpdateFreq: { [key: string]: string } = {
    '1': '天',
    '2': '周',
    '3': '月',
    '4': '季',
    '5': '年'
}
export const updateMode: { [key: string]: string } = {
    '1': '全量',
    '2': '增量'
}
export const securityClass: { [key: string]: string } = {
    '1': '公开',
    '2': '保密',
    '3': '机密',
    '4': '绝密',
}


export const customerSource: { [key: string]: string } = {
    'BID': 'Passport账号',
    'CMID': '信贷业务后台基于身份证生成个人ID',
    'CUID': '个人设备编码',
    'CID': '钱包支付基于身份证生成个人ID',
    '身份证号': '中国公民身份账号',
    'Icoshuid': '主场景基于用户session生成的个人标识',
    '微信账号': '个人微信登录账号',
    '其它': '其它',
}