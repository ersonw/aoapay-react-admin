import React from 'react';
import BreadcrumbCustom from '../components/widget/BreadcrumbCustom';
import { Button, Card, Col, Input, message, Modal, Row, Table } from 'antd';
import { SnippetsOutlined } from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
import { ColumnProps } from 'antd/lib/table';
import { getClient, setClientDeleteAll, setClientDelete, setClientAdd } from '../service';
import moment from 'moment/moment';
class Client extends React.Component<any> {
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
        auth: {},
    };
    columns: ColumnProps<any>[] = [];
    showResult(text: any) {
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `请妥善复制到剪贴板，一个链接只针对一个客户，请勿恶意生成！`,
            content: `内容: ${text}`,
            onOk: () => {
                copyToClipboard(text);
                message.success('复制成功!');
            },
            okText: '复制并关闭',
            cancelText: '关闭',
        });
    }
    componentDidMount() {
        const { auth, query } = this.props;
        this.setState({ auth, query });
        this.columns = [
            {
                title: 'TOKEN',
                dataIndex: 'id',
                key: 'id',
                width: 270,
                fixed: 'left',
            },
        ];
        this.columns.push({
            title: '首次访问IP',
            dataIndex: 'ip',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text !== undefined && text) {
                    return (
                        <>
                            <span>{text}</span>
                            <SnippetsOutlined
                                style={{ marginLeft: '3px' }}
                                onClick={() => {
                                    copyToClipboard(text);
                                    message.success('复制成功!');
                                }}
                            />
                        </>
                    );
                }
            },
        });
        this.columns.push({
            title: '最新访问IP',
            dataIndex: 'ipUpdate',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text !== undefined && text) {
                    return (
                        <>
                            <span>{text}</span>
                            <SnippetsOutlined
                                style={{ marginLeft: '3px' }}
                                onClick={() => {
                                    copyToClipboard(text);
                                    message.success('复制成功!');
                                }}
                            />
                        </>
                    );
                }
            },
        });
        if ((auth as any).superAdmin || (auth as any).admin) {
            this.columns.push({
                title: '上级',
                dataIndex: 'username',
                width: 100,
            });
            this.columns.push({
                title: '首次访问域名',
                dataIndex: 'serverName',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    if (text !== undefined && text) {
                        return (
                            <>
                                <span>{text}</span>
                                <SnippetsOutlined
                                    style={{ marginLeft: '3px' }}
                                    onClick={() => {
                                        copyToClipboard(text);
                                        message.success('复制成功!');
                                    }}
                                />
                            </>
                        );
                    }
                },
            });
            this.columns.push({
                title: '首次访问URL',
                dataIndex: 'url',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    if (text !== undefined && text) {
                        return (
                            <>
                                <span>{text}</span>
                                <SnippetsOutlined
                                    style={{ marginLeft: '3px' }}
                                    onClick={() => {
                                        copyToClipboard(text);
                                        message.success('复制成功!');
                                    }}
                                />
                            </>
                        );
                    }
                },
            });
            this.columns.push({
                title: '最新访问域名',
                dataIndex: 'serverNameUpdate',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    if (text !== undefined && text) {
                        return (
                            <>
                                <span>{text}</span>
                                <SnippetsOutlined
                                    style={{ marginLeft: '3px' }}
                                    onClick={() => {
                                        copyToClipboard(text);
                                        message.success('复制成功!');
                                    }}
                                />
                            </>
                        );
                    }
                },
            });
            this.columns.push({
                title: '最新访问URL',
                dataIndex: 'urlUpdate',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    if (text !== undefined && text) {
                        return (
                            <>
                                <span>{text}</span>
                                <SnippetsOutlined
                                    style={{ marginLeft: '3px' }}
                                    onClick={() => {
                                        copyToClipboard(text);
                                        message.success('复制成功!');
                                    }}
                                />
                            </>
                        );
                    }
                },
            });
        }
        this.columns.push({
            title: '添加时间',
            dataIndex: 'addTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        });
        this.columns.push({
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        });
        if (!(auth as any).admin) {
            this.columns.push({
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
                            onClick={() => this.onDelete(record)}
                        >
                            删除
                        </Button>
                    );
                },
            });
        }
        this.start();
    }
    onDelete(record: any) {
        this.setState({ loading: true });
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `确定要删除?`,
            content: `Token:${record.id}`,
            onOk: () => {
                setClientDelete({ id: record.id }).then((_) => {
                    let { data } = this.state;
                    this.setState({ data: [] });
                    const index = data.findIndex((e: any) => e.id === record.id);
                    if (index > -1) {
                        data.splice(index, 1);
                    }
                    this.setState({ data, loading: false });
                });
            },
            onCancel: () => {
                this.setState({ loading: false });
            },
            okText: '继续删除',
            cancelText: '取消删除',
        });
    }
    onSelectChange = (selectedRowKeys: string[]) => {
        this.setState({ selectedRowKeys });
    };
    start = () => {
        this.setState({ loading: true });
        getClient({
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
    onSearchChange(event: any) {
        this.setState({
            title: event.target.value,
            currentPage: 1,
        });
    }
    onKeyDown(event: any) {
        if (event.key === 'Enter') this.start();
    }
    async onRefresh() {
        await this.setState({ currentPage: 1, title: undefined });
        this.start();
    }
    onAdd() {
        this.setState({ loading: true });
        setClientAdd().then((value: any) => {
            if (value !== undefined && value !== null) {
                const { url } = value;
                if (url !== undefined) {
                    this.showResult(url);
                }
            }
            this.setState({ loading: false });
        });
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
                setClientDeleteAll(this.state.selectedRowKeys).then((_) => {
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
    async antdShowSizeChange(current: number, size?: number) {
        await this.setState({
            currentPage: current,
            pageSize: size,
        });
        // this.start();
    }
    render() {
        const { loading } = this.state as any;
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div className="gutter-example">
                <BreadcrumbCustom breads={['客户端管理', '所有客户端']} />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="所有客户端" bordered={false}>
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
                                        placeholder="搜索TOKEN"
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
                                        type="primary"
                                        onClick={this.onAdd.bind(this)}
                                        disabled={loading}
                                        loading={loading}
                                    >
                                        生成邀请
                                    </Button>
                                    <Button
                                        type="ghost"
                                        onClick={this.onDeleteAll.bind(this)}
                                        disabled={loading}
                                        loading={loading}
                                    >
                                        批量删除{this.state.selectedRowKeys.length}
                                    </Button>
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
export default Client;
