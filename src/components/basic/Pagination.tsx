import * as React from 'react';

export interface PageData {
    pageSize: number;
    currentPage: number;
    pageTotal: number;
}

export class Pagination extends React.Component<{ data?: PageData, callback?: (pageNo: number) => void }, {}> {
    btnVal = 'Go';
    pageIntputId: string;
    constructor(props:any) {
        super(props);
        this.pageIntputId = `go${Date.now()}`;
        this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onKeyDownEvent(e: any) {
        if (e.keyCode === 13 && this.props && this.props.callback) {
            let val:any = e.target.value;
            let num:number = parseInt(val, 10);
            if (this.props && this.props.data && this.props.callback) {
                if (num > 0 && num <= this.props.data.pageTotal) {
                    this.props.callback(num);
                } else {
                    toastr.error('页码范围跑偏了!');
                }
            }
        }
    }

    onClick(e: React.MouseEvent<HTMLAnchorElement>) {
        let numS: any;
        if (this.btnVal === $(e.target).html()) {
            numS = $(`#${this.pageIntputId}`).val();
        } else {
            numS = $(e.target).attr('data-pageno');
        }
        if (numS && this.props && this.props.callback) {
            let num = parseInt(numS, 10);
            if (num > 0 && num <= this.props.data.pageTotal) {
                this.props.callback(num);
            } else {
                toastr.error('页码范围跑偏了!');
            }
        }
    }

    render() {
        let pageData: PageData;
        if (this.props.data) {
            pageData = this.props.data;
        } else {
            pageData = {
                currentPage: 1,
                pageSize: 10,
                pageTotal: 1
            };
        }
        let pageShowNums = 5;
        let beginPage = pageData.currentPage - (pageShowNums - 1) / 2;
        let endPage = pageData.currentPage - (pageShowNums - 1) / 2;
        if (beginPage < 1) {
            beginPage = 1;
        }
        if (endPage - beginPage < (pageShowNums - 1)) {
            endPage = beginPage + (pageShowNums - 1);
        }
        if (endPage > pageData.pageTotal) {
            endPage = pageData.pageTotal;
        }
        if (endPage - beginPage < (pageShowNums - 1)) {
            beginPage = endPage - (pageShowNums - 1);
        }
        if (beginPage < 1) {
            beginPage = 1;
        }
        let nums = new Array();
        let key = 0;
        if (pageData.currentPage > 1) {
            nums.push(<li key={++key}><a href='javascript:;' onClick={this.onClick} data-pageno='1'>首页</a></li>);
            nums.push(<li key={++key}><a href='javascript:;' onClick={this.onClick} data-pageno={pageData.currentPage - 1}>上一页</a></li>);
        } else {
            nums.push(<li key={++key} className='disabled'><a href='javascript:;'>首页</a></li>);
            nums.push(<li key={++key} className='disabled'><a href='javascript:;'>上一页</a></li>);
        }
        for (let i = beginPage; i <= endPage; ++i) {
            nums.push(
                <li key={++key} className={pageData.currentPage === i ? 'active' : ''}>
                    <a href='javascript:;' onClick={this.onClick} data-pageno={i}>{i}</a>
                </li>
            );
        }
        if (pageData.currentPage < pageData.pageTotal) {
            nums.push(<li key={++key}><a href='javascript:;' onClick={this.onClick} data-pageno={pageData.currentPage + 1}>下一页</a></li>);
            nums.push(<li key={++key}><a href='javascript:;' onClick={this.onClick} data-pageno={pageData.pageTotal}>末页</a></li>);
        } else {
            nums.push(<li key={++key} className='disabled'><a href='javascript:;'>下一页</a></li>);
            nums.push(<li key={++key} className='disabled'><a href='javascript:;'>末页</a></li>);
        }
        nums.push(
            <li key={++key}><a href='javascript:;'>第{pageData.currentPage}页/共{pageData.pageTotal}页</a></li>
        );
        let inputLinkStyle = {
            padding: '0px',
            border: '0px'
        };
        let inputStyle = {
            width: '100px',
        };
        return (
            <div className='form-inline'>
                <ul className='pagination pagination-sm'>
                    {nums}
                    <li>
                        <a style={inputLinkStyle}>
                            <input style={inputStyle} className='form-control input-sm'
                                onKeyDown={this.onKeyDownEvent} id={this.pageIntputId}
                                type='number' min={1} max={pageData.pageTotal} placeholder='跳转页码'>
                            </input>
                        </a>
                    </li>
                    <li>
                        <a className='form-control input-sm' href='javascript:;' onClick={this.onClick}>
                            {this.btnVal}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}