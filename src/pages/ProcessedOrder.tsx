/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Input, message, Modal } from 'antd';
import { confirmBasicOrder, getProcessedOrder } from '../service';
import BreadcrumbCustom from '../components/widget/BreadcrumbCustom';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import copyToClipboard from 'copy-to-clipboard';
import { SnippetsOutlined } from '@ant-design/icons';
moment.locale('zh-cn');

class ProcessedOrder extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        data: [],
        currentPage: 1,
        total: 1,
        pageSize: 30,
        title: undefined,
        showModalLoading: false,
        showModal: false,
        record: {
            orderNo: '',
            outTradeNo: '',
            name: '',
            username: '',
            money: '0',
            tradeStatus: false,
            link: '',
            id: '',
        },
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
            title: '订单号',
            dataIndex: 'outTradeNo',
            width: 180,
            key: 'outTradeNo',
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
            title: '交易单号',
            dataIndex: 'tradeNo',
            width: 220,
        },
        {
            title: '交易时间',
            dataIndex: 'tradeTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '处理状态',
            dataIndex: 'status',
            width: 120,
            render: (text: any, record: any, index: Number) => {
                return (
                    <span style={{ color: (text as boolean) ? 'green' : 'gray' }}>
                        {(text as boolean) ? '已处理' : '待处理'}
                    </span>
                );
            },
        },
        {
            title: '提交时间',
            dataIndex: 'addTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '处理时间',
            dataIndex: 'updateTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '提交IP',
            dataIndex: 'ip',
            width: 120,
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text: any, record: any, index: Number) => {
                // console.log(record);
                return (
                    <Button
                        disabled={record.status as boolean}
                        style={{ color: (record.status as boolean) ? 'gray' : 'red' }}
                        onClick={() => this.handlerModal(record, index)}
                        // onClick={() => {
                        //     return message.open({
                        //         content: `正在处理订单编号：${record.orderNo}`,
                        //         duration: 0,
                        //         type: 'loading',
                        //     } as any);
                        // }}
                    >
                        处理
                    </Button>
                );
            },
        },
    ];
    handlerModal = (record: any, index: Number) => {
        this.setState({ showModal: true, record: record });
    };
    componentDidMount() {
        this.start();
    }
    async antdShowSizeChange(current: number, size?: number) {
        await this.setState({
            currentPage: current,
            pageSize: size,
        });
        // this.start();
    }
    start = () => {
        this.setState({ loading: true });
        getProcessedOrder({
            title: this.state.title,
            page: this.state.currentPage,
            limit: this.state.pageSize,
        }).then(({ list, total }: { list: any; total: bigint }) => {
            this.setState({
                loading: false,
                data: list,
                total: total,
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
    async onModalOk(event: any) {
        this.setState({ showModalLoading: true });
        Modal.confirm({
            mask: true,
            title: `是否已处理订单编号${this.state.record.orderNo}`,
            onOk: () => {
                confirmBasicOrder({ id: this.state.record.id }).then((data) => {
                    if (data !== undefined && data !== null) {
                        const list = this.state.data;
                        this.setState({ data: [] });
                        const index = list.findIndex((v: any) => v.id === data.id);
                        list.splice(index, 1);
                        this.setState({ showModal: false, data: list });
                    }
                    this.setState({ showModalLoading: false });
                });
            },
            onCancel: () => {
                this.setState({ showModalLoading: false });
            },
            okText: '我已确定',
            cancelText: '我不确定',
        });
    }
    onModalCancel(event: any) {
        this.setState({ showModal: false });
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
                            <Card title="所有订单" bordered={false}>
                                <Modal
                                    title="处理订单"
                                    visible={this.state.showModal}
                                    onOk={this.onModalOk.bind(this)}
                                    onCancel={this.onModalCancel.bind(this)}
                                    okText={'我已确定'}
                                    cancelText={'暂未处理'}
                                    confirmLoading={this.state.showModalLoading}
                                >
                                    <p>
                                        订单编号:{this.state.record.orderNo}
                                        <SnippetsOutlined
                                            style={{ marginLeft: '3px' }}
                                            onClick={() => {
                                                copyToClipboard(this.state.record.link);
                                                message.success('复制客户端链接成功!');
                                            }}
                                        />
                                    </p>
                                    <p>
                                        订单号:{this.state.record.outTradeNo}
                                        <SnippetsOutlined
                                            style={{ marginLeft: '3px' }}
                                            onClick={() => {
                                                copyToClipboard(this.state.record.outTradeNo);
                                                message.success('复制订单号成功!');
                                            }}
                                        />
                                    </p>
                                    <p>姓名:{this.state.record.name}</p>
                                    <p>
                                        会员账号:{this.state.record.username}
                                        <SnippetsOutlined
                                            style={{ marginLeft: '3px' }}
                                            onClick={() => {
                                                copyToClipboard(this.state.record.username);
                                                message.success('复制会员账号成功!');
                                            }}
                                        />
                                    </p>
                                    <p>充值金额:{this.state.record.money}元</p>
                                    <p>
                                        付款状态:
                                        {this.state.record.tradeStatus ? '已付款' : '待付款'}
                                    </p>
                                </Modal>
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
                                        suffix={
                                            <Button
                                                type="primary"
                                                onClick={this.start.bind(this)}
                                                disabled={loading}
                                            >
                                                搜索
                                            </Button>
                                        }
                                        onKeyDown={this.onKeyDown.bind(this)}
                                        disabled={loading}
                                    />
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

export default ProcessedOrder;
