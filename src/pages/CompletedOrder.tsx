/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import {Table, Button, Row, Col, Card, Input, DatePicker} from 'antd';
import { getCompletedOrder } from '../service';
import BreadcrumbCustom from '../components/widget/BreadcrumbCustom';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import {RangeValue} from 'rc-picker/lib/interface'
import { Moment } from 'moment';
const { RangePicker } = DatePicker;
moment.locale('zh-cn');

class CompletedOrder extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        data: [],
        currentPage: 1,
        total: 1,
        count: 0,
        pageSize: 30,
        title: undefined,
        start: undefined,
        end: undefined,
    };
    columns: ColumnProps<any>[] = [
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 100,
            fixed: 'left',
        },
        {
            title: '提交金额',
            dataIndex: 'money',
            width: 100,
        },
        {
            title: '会员姓名',
            dataIndex: 'name',
            width: 100,
        },
        {
            title: '会员账号',
            dataIndex: 'username',
            width: 100,
        },
        {
            title: '实际到账',
            dataIndex: 'totalFee',
            width: 100,
        },
        {
            title: '支付状态',
            dataIndex: 'tradeStatus',
            width: 100,
            render: (text: any, record: any, index: Number) => {
                return (
                    <span style={{ color: (text as boolean) ? 'green' : 'gray' }}>
                        {(text as boolean) ? '已付款' : '待付款'}
                    </span>
                );
            },
        },
        {
            title: '经手人',
            dataIndex: 'updateUser',
            width: 180,
        },
        {
            title: '处理时间',
            dataIndex: 'updateTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '处理IP',
            dataIndex: 'updateUserIp',
            width: 180,
        },
    ];
    componentDidMount() {
        this.start();
    }
    async antdShowSizeChange(current: number, size?: number) {
        await this.setState({
            currentPage: current,
            pageSize: size,
        });
    }
    start = () => {
        this.setState({ loading: true });
        getCompletedOrder({
            title: this.state.title,
            page: this.state.currentPage,
            limit: this.state.pageSize,
            start: this.state.start,
            end: this.state.end,
        }).then(({ list, total, count }: { list: any; total: bigint, count: bigint }) => {
            this.setState({
                loading: false,
                data: list,
                total: total,
                count: count,
            });
        });
    };
    onSelectChange = (selectedRowKeys: string[]) => {
        this.setState({ selectedRowKeys });
    };
    onSearchChange(event: any) {
        this.setState({
            title: event.target.value,
            currentPage: 1,
        });
    }
    async onRefresh() {
        await this.setState({ currentPage: 1, title: undefined });
        this.start();
    }
    onKeyDown(event: any) {
        if (event.key === 'Enter') this.start();
    }
    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="gutter-example">
                <BreadcrumbCustom breads={['订单管理', '订单列表']} />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="已完成订单" bordered={false}>
                                <div
                                    style={{
                                        marginBottom: 16,
                                        justifyContent: 'flex-center',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Input
                                        style={{ width: 360, margin: 'auto 16px' }}
                                        type="text"
                                        size={'middle'}
                                        placeholder="订单编号或者订单号"
                                        value={this.state.title}
                                        onChange={this.onSearchChange.bind(this)}
                                        onKeyDown={this.onKeyDown.bind(this)}
                                        disabled={loading}
                                    />
                                    <RangePicker
                                        allowEmpty={[true,true]}
                                        format="YYYY-MM-DD HH:mm"
                                        showTime = {{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                                        allowClear
                                        inputReadOnly
                                        locale={zh_CN}
                                        picker={'date'}
                                        onChange={(e: RangeValue<Moment>)=>{
                                            if (e === undefined || e === null) {
                                                this.setState({start: undefined, end: undefined});
                                                return;
                                            }
                                            this.setState({start: e[0]?.valueOf(), end: e[1]?.valueOf()});
                                        }}
                                        value={[(this.state.start && moment(this.state.start)),(this.state.end && moment(this.state.end))] as any}
                                    />
                                    <Button
                                        style={{margin: 'auto 16px'}}
                                        type="primary"
                                        onClick={this.start.bind(this)}
                                        disabled={loading}
                                    >
                                        搜索
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={this.onRefresh.bind(this)}
                                        disabled={loading}
                                        loading={loading}
                                    >
                                        刷新列表
                                    </Button>
                                    <span style={{ marginLeft: 8 }}>
                                        {hasSelected ? `选择 ${selectedRowKeys.length} 条` : ''}
                                    </span>
                                    { (this.state.start || this.state.end) && (
                                        <span style={{margin: 'auto 16px'}}>
                                            当前条件总计：{this.state.count} 元
                                        </span>
                                    )}
                                </div>
                                <Table
                                    rowKey={'id'}
                                    rowSelection={rowSelection as any}
                                    columns={this.columns}
                                    dataSource={this.state.data}
                                    scroll={{ x: 1300 }}
                                    loading={loading}
                                    pagination={{
                                        hideOnSinglePage: true,
                                        current: this.state.currentPage,
                                        total: this.state.total,
                                        pageSize: this.state.pageSize,
                                        onChange: this.antdShowSizeChange.bind(this),
                                    }}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CompletedOrder;
