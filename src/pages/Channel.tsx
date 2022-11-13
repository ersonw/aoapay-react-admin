/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Button, Select, Switch } from 'antd';
import { Table, Row, Col, Card, Input, message, Modal } from 'antd';
import {
    setChannelChange,
    getChannel,
    setChannelEnabled,
    setChannelEnabledAll,
    setChannelAdd,
    setChannelDeleteAll, setUserEnabled,
} from '../service';
import BreadcrumbCustom from '../components/widget/BreadcrumbCustom';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { SnippetsOutlined } from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
moment.locale('zh-cn');
const { Option } = Select;
class Channel extends React.Component {
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
        showDrawer: false,
        record: {},
        auth: {
            superAdmin: false,
            admin: false,
        },
    };
    columns: ColumnProps<any>[] = [
        {
            title: '渠道名',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            fixed: 'left',
        },
        {
            title: '通道类型',
            dataIndex: 'type',
            width: 100,
            key: 'type',
            fixed: 'left',
            render: (text: any, record: any, index: number) => {
                return <span>{this.switchType(text)}</span>;
            },
        },
        {
            title: '第三方系统',
            dataIndex: 'channel',
            width: 100,
            render: (text: any, record: any, index: Number) => {
                return <span>{this.channels[text]}</span>;
            },
        },
        {
            title: '单笔最大',
            dataIndex: 'max',
            width: 100,
        },
        {
            title: '单笔最小',
            dataIndex: 'mini',
            width: 100,
        },
        {
            title: '显示顺序',
            dataIndex: 'sort',
            width: 100,
        },
        {
            title: '启用状态',
            dataIndex: 'enabled',
            width: 100,
            render: (text: any, record: any, index: Number) => {
                return (
                    <Switch
                        checked={text}
                        onChange={() => {
                            return Modal.confirm({
                                mask: true,
                                title: `${!(text as boolean) ? '启用' : '禁用'}渠道[${
                                    record.title
                                }]`,
                                onOk: () => {
                                    this.setState({ loading: true });
                                    setChannelEnabled({ id: record.id }).then((data) => {
                                        if (data !== undefined && data !== null) {
                                            const list = this.state.data;
                                            this.setState({ data: [] });
                                            const index = list.findIndex(
                                                (v: any) => v.id === data.id
                                            );
                                            list.splice(index, 1, data as never);
                                            this.setState({ data: list, loading: false });
                                        }
                                    });
                                },
                                cancelText: '返回',
                                okText: '继续',
                            });
                        }}
                    />
                );
            },
        },
        {
            title: '第三方通道代码',
            dataIndex: 'typeCode',
            width: 220,
        },
        {
            title: '添加时间',
            dataIndex: 'addTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
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
                        style={{ color: 'red' }}
                        onClick={() => this.handlerModal(record, index)}
                    >
                        修改参数
                    </Button>
                );
            },
        },
    ];
    handlerModal = (record: any, index: Number) => {
        const result = { ...record };
        if (this.state.auth && this.state.auth.superAdmin)
            this.setState({ showModal: true, record: result });
    };
    componentDidMount() {
        const { auth, query } = this.props as any;
        this.setState({
            auth: auth,
            query: query,
        });
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
        getChannel({
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
    onDeleteAll() {
        this.setState({ loading: true });
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `是否删除${this.state.selectedRowKeys.length}项?`,
            content: '',
            onOk: () => {
                setChannelDeleteAll(this.state.selectedRowKeys).then((_) => {
                    const ids = this.state.selectedRowKeys;
                    let { data } = this.state;
                    this.setState({ data: [] });
                    for (let i = 0; i < ids.length; i++) {
                        const index = data.findIndex((e: any) => e.id === ids[i]);
                        data.splice(index, 1);
                    }
                    this.setState({ data: data, loading: false, selectedRowKeys: [] });
                });
            },
            onCancel: () => {
                this.setState({ loading: false });
            },
            okText: '继续提交',
            cancelText: '取消提交',
        });
    }
    onKeyDown(event: any) {
        if (event.key === 'Enter') this.start();
    }
    async onModalOk(event: any) {
        this.setState({ showModalLoading: true });
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `是否提交${(this.state.record as any).id !== undefined ? '更改' : '添加'}?`,
            content: '',
            onOk: () => {
                let record = this.state.record;
                let { amountList } = record as any;
                amountList = Array.from(new Set(amountList));
                amountList = amountList.filter((d: any) => {
                    // return !isNaN(parseInt(d));
                    return new RegExp(/^\+?[1-9][0-9]*$/).test(d);
                });
                if (amountList.length === 0) {
                    amountList.push((record as any).mini);
                }
                amountList = amountList.map((amount: string) => parseInt(amount));
                amountList = amountList.sort((a: number, b: number) => a - b);
                record = { ...record, amountList };
                if ((record as any).id !== undefined) {
                    setChannelChange(record).then((data: any) => {
                        if (data !== undefined && data !== null) {
                            const list = this.state.data;
                            this.setState({ data: [] });
                            const index = list.findIndex((v: any) => v.id === data.id);
                            list.splice(index, 1, data as never);
                            this.setState({ showModal: false, record: {}, data: list });
                            this.restRecord();
                        }
                        this.setState({ showModalLoading: false });
                    });
                } else {
                    setChannelAdd(record).then((data: any) => {
                        if (data !== undefined && data !== null) {
                            const list = this.state.data;
                            this.setState({ data: [] });
                            list.unshift(data as never);
                            this.setState({ showModal: false, record: {}, data: list });
                            this.restRecord();
                        }
                        this.setState({ showModalLoading: false });
                    });
                }
            },
            onCancel: () => {
                this.setState({ showModalLoading: false,record: {}, });
            },
            okText: '继续提交',
            cancelText: '取消提交',
        });
    }
    type = [
        {
            name: '银联卡',
            key: 'union',
        },
        {
            name: '支付宝',
            key: 'alipay',
        },
        {
            name: '微信支付',
            key: 'wxpay',
        },
        {
            name: 'QQ支付',
            key: 'qqpay',
        },
        {
            name: '天猫支付',
            key: 'tianmao',
        },
        {
            name: '淘宝支付',
            key: 'taobao',
        },
        {
            name: '云闪付',
            key: 'yunshanfu',
        },
        {
            name: '京东支付',
            key: 'jingdong',
        },
    ];
    channels = ['未知', '艺博支付', '蒲公英支付'];
    switchType(type: string) {
        for (let i = 0; i < this.type.length; i++) {
            if (this.type[i].key === type) return this.type[i].name;
        }
        return '未知';
    }
    onModalCancel(event: any) {
        this.setState({ showModal: false, record: {} });
        this.restRecord();
    }
    onChangeAll() {
        this.setState({ loading: true });
        setChannelEnabledAll(this.state.selectedRowKeys).then((list) => {
            const data = this.state.data;
            this.setState({ data: [] });
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const index = data.findIndex((v: any) => v.id === item.id);
                data.splice(index, 1, item as never);
            }
            this.setState({ data: data, loading: false });
        });
    }
    restRecord() {
        this.setState({ record: {} });
    }
    onAdd() {
        if (this.state.auth && this.state.auth.superAdmin)
            this.setState({ showModal: true, record: {} });
    }
    onChangeInput(key: string, value: any) {
        let record = this.state.record;
        (record as any)[key] = value;
        this.setState({ record });
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
                <BreadcrumbCustom breads={['渠道管理', '所有渠道']} />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="所有渠道" bordered={false}>
                                <Modal
                                    title="编辑第三方"
                                    visible={this.state.showModal}
                                    destroyOnClose={false}
                                    onOk={this.onModalOk.bind(this)}
                                    onCancel={this.onModalCancel.bind(this)}
                                    okText={'提交'}
                                    cancelText={'返回'}
                                    confirmLoading={this.state.showModalLoading}
                                    maskClosable={false}
                                    style={{
                                        minWidth: '720px',
                                        minHeight: '300px',
                                        maxWidth: '100vw',
                                        maxHeight: '100vh',
                                    }}
                                >
                                    <span>显示名称:</span>
                                    <Input
                                        value={(this.state.record as any).title}
                                        placeholder="前台显示的名称"
                                        onChange={(e: any) => {
                                            this.onChangeInput('title', e.target.value);
                                        }}
                                    />
                                    <div style={{ display: 'flex' }}>
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span>最小金额:</span>
                                            <Input
                                                type="number"
                                                value={(this.state.record as any).mini}
                                                placeholder="最小金额"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('mini', e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span>最大金额:</span>
                                            <Input
                                                type="number"
                                                value={(this.state.record as any).max}
                                                placeholder="最大金额"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('max', e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span>显示排序:</span>
                                            <Input
                                                type="number"
                                                value={(this.state.record as any).sort}
                                                placeholder="输入值越大越排前面"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('sort', e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span>日限金额:</span>
                                            <Input
                                                type="number"
                                                value={(this.state.record as any).limit}
                                                placeholder="最小金额"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('limit', e.target.value);
                                                }}
                                            />
                                        </div>
                                        {(this.state.auth as any).superAdmin && (
                                            <div
                                                style={{
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span>第三方系统:</span>
                                                <Select
                                                    value={
                                                        (this.state.record as any).channel
                                                    }
                                                    style={{ width: 120, marginRight: 10 }}
                                                    onChange={(val: number) => {
                                                        this.onChangeInput('channel', val);
                                                    }}
                                                >
                                                    {this.channels.map(
                                                        (item: any, index: number) => (
                                                            <Option key={index} value={index}>
                                                                {item}
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span>固定金额:</span>
                                            <Input
                                                type="text"
                                                value={(
                                                    (this.state.record as any).amountList || []
                                                ).join(';')}
                                                placeholder="固定金额 ; 符号分开 例如100;200;300;"
                                                onChange={(e: any) => {
                                                    let list = e.target.value.split(';');
                                                    const getCount = (arr: any[]) => {
                                                        let j = 0;
                                                        for (let i = 0; i < arr.length; i++) {
                                                            if (arr[i] === '') {
                                                                j++;
                                                            }
                                                        }
                                                        return j;
                                                    };
                                                    const count = getCount(list);
                                                    if (count > 0) {
                                                        list = Array.from(new Set(list));
                                                        list = list.filter((d: any) => {
                                                            // return !isNaN(parseInt(d));
                                                            return new RegExp(
                                                                /^\+?[1-9][0-9]*$/
                                                            ).test(d);
                                                        });
                                                        // list = list.map((d: any) => parseInt(d));
                                                        list.push('');
                                                    }
                                                    this.onChangeInput('amountList', list);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            margin: '9px 6px',
                                            justifyContent: 'fix-center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span>是否自定义金额:</span>
                                        <p />
                                        <Switch
                                            checked={(this.state.record as any).voluntarily}
                                            onChange={(e) => this.onChangeInput('voluntarily', e)}
                                        />
                                    </div>
                                    {(this.state.auth as any).superAdmin && (
                                        <>
                                            <div style={{ display: 'flex' }}>
                                                <div
                                                    style={{
                                                        margin: '9px 6px',
                                                        justifyContent: 'fix-center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>商户ID:</span>
                                                    <Input
                                                        type="text"
                                                        value={(this.state.record as any).mchId}
                                                        placeholder="第三方后台获取"
                                                        onChange={(e: any) => {
                                                            this.onChangeInput(
                                                                'mchId',
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        margin: '9px 6px',
                                                        justifyContent: 'fix-center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>通道类型:</span>
                                                    <Select
                                                        value={
                                                            (this.state.record as any).type
                                                        }
                                                        style={{ width: 120, marginRight: 10 }}
                                                        onChange={(val: any) => {
                                                            this.onChangeInput('type', val);
                                                        }}
                                                    >
                                                        {this.type.map(
                                                            (item: any, index: number) => (
                                                                <Option
                                                                    key={index}
                                                                    value={item.key}
                                                                >
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>
                                                <div
                                                    style={{
                                                        margin: '9px 6px',
                                                        justifyContent: 'fix-center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <span>支付代码:</span>
                                                    <Input
                                                        type="text"
                                                        value={(this.state.record as any).typeCode}
                                                        placeholder="提交给第三方的代码"
                                                        onChange={(e: any) => {
                                                            this.onChangeInput(
                                                                'typeCode',
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ width: '30%' }}>商户密钥:</span>
                                                <Input
                                                    type="text"
                                                    value={(this.state.record as any).secretKey}
                                                    placeholder="第三方后台获取"
                                                    onChange={(e: any) => {
                                                        this.onChangeInput(
                                                            'secretKey',
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ width: '30%' }}>请求地址:</span>
                                                <Input
                                                    type="text"
                                                    value={(this.state.record as any).domain}
                                                    placeholder="第三方后台获取"
                                                    onChange={(e: any) => {
                                                        this.onChangeInput(
                                                            'domain',
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ width: '30%' }}>同步返回:</span>
                                                <Input
                                                    type="text"
                                                    value={(this.state.record as any).callbackUrl}
                                                    placeholder="后台配置"
                                                    onChange={(e: any) => {
                                                        this.onChangeInput(
                                                            'callbackUrl',
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span style={{ width: '30%' }}>异步返回:</span>
                                                <Input
                                                    type="text"
                                                    value={(this.state.record as any).notifyUrl}
                                                    placeholder="后台配置"
                                                    onChange={(e: any) => {
                                                        this.onChangeInput(
                                                            'notifyUrl',
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                    <p>
                                        后台编号:{(this.state.record as any).id}
                                        <SnippetsOutlined
                                            style={{ marginLeft: '3px' }}
                                            onClick={() => {
                                                copyToClipboard((this.state.record as any).id);
                                                message.success('复制成功!');
                                            }}
                                        />
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
                                        placeholder="搜索渠道名或者通道类型"
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
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        type={'ghost'}
                                        onClick={this.onChangeAll.bind(this)}
                                    >
                                        批量切换{hasSelected ? `${selectedRowKeys.length} 条` : ''}
                                    </Button>
                                    {(this.state.auth as any).superAdmin && (
                                        <>
                                            <Button
                                                type="primary"
                                                onClick={this.onAdd.bind(this)}
                                                disabled={loading}
                                                loading={loading}
                                            >
                                                添加渠道
                                            </Button>
                                            <Button
                                                type="ghost"
                                                onClick={this.onDeleteAll.bind(this)}
                                                disabled={loading}
                                                loading={loading}
                                            >
                                                批量删除
                                            </Button>
                                        </>
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

export default Channel;
