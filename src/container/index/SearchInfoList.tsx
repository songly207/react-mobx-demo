import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { IBase } from '../../contants/base';
import { SearchCell } from '../../components/basic/SearchCell';
import { Pagination } from '../../components/basic/Pagination';
import { DataTableModal } from './DataTableModal';

@inject('store')
@observer
export class SearchInfoList extends React.Component<IBase, {}> {
    paginationCallBack(pageNo: number) {
        this.props.store.pageUp(pageNo);
    }
    render() {
        return (
            <div className='row'>
                {this.props.store.todo.dataModal.show &&
                <DataTableModal id={this.props.store.todo.dataModal.id} />
                }
                {this.props.store.todo.data.currentList.map((e, index) => {
                    return <SearchCell key={index} data={e} />
                })}
                <hr />
                <Pagination data={this.props.store.todo.page} callback={this.paginationCallBack.bind(this)} />
            </div>);
    }
}