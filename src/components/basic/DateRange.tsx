import * as React from 'react';
import { DatePicker } from 'antd';
import moment = require('moment');

interface startValue  {
    updateLifeCicle: Function
    startValue?: null,
    endValue?: null,
    endOpen?: false,
}

class DateRange extends React.Component<startValue> {
    constructor(props:any){
        super(props);
    }
    state: any = {
        startValue: null,
        endValue: moment('9999-12-31'),
        endOpen: false,
    };
    disabledStartDate = (startValue: any) => {
        // const endValue: any = this.state.endValue;
        if (!startValue) {
            return false;
        }
        return !startValue.valueOf();
    }

    disabledEndDate = (endValue: any) => {
        const startValue: any = this.state.startValue;
        if (!startValue) {
            return true;
        }
        return false;
    }

    onChange = (field: any, value: any) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value: any) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value: any) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open: boolean) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open: boolean) => {
        this.setState({ endOpen: open });
        if(!open){
            this.props.updateLifeCicle(this.state.startValue,this.state.endValue)
        }
    }

    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div>
                <DatePicker
                    style={{float: 'left'}}
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={startValue}
                    placeholder="起始时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <span style={{ float: 'left',marginTop: '5px' }}>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                    
                <DatePicker
                    style={{ float: 'left' }}
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD"
                    value={endValue}
                    defaultValue={ moment('9999-12-31')}
                    placeholder="终止时间"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                /> 
            </div>
        );
    }
}
export default DateRange;