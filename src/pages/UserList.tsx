import React from 'react';
import BreadcrumbCustom from '../components/widget/BreadcrumbCustom';
import { Button, Card, Col, Input, message, Modal, Row, Select, Switch, Table } from 'antd';
import { SnippetsOutlined } from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
import { ColumnProps } from 'antd/lib/table';
import {
    getUser,
    setUserChange,
    setUserEnabled,
    setUserAdd,
    setUserDeleteAll,
    setUserAdmin,
    setUserSuper
} from '../service';
import moment from 'moment/moment';
const { Option } = Select;

class UserList extends React.Component<any> {
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
        record: {},
        auth: {},
    };
    roles: any = [];
    columns: ColumnProps<any>[] = [];
    switchRoles(id: any) {
        if (id === null) return '管理员';
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id === id) return this.roles[i].name;
        }
        return '未知';
    }
    onChangePassword(record: any) {
        this.setState({ loading: true });
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `是否重置用户${record.username}密码?`,
            content: '',
            onOk: () => {
                setUserChange({ id: record.id }).then((value: any) => {
                    if (value !== null) {
                        const { password } = value;
                        this.showPasswordResult(password);
                    }
                    this.setState({ loading: false });
                });
            },
            onCancel: () => {
                this.setState({ loading: false });
            },
            okText: '继续提交',
            cancelText: '取消提交',
        });
    }
    showPasswordResult(password: any) {
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `请妥善保存，不可找回！`,
            content: `密码: ${password}`,
            onOk: () => {
                copyToClipboard(password);
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
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: 200,
                fixed: 'left',
            },
            {
                title: '开户人',
                dataIndex: 'superiorName',
                width: 100,
                key: 'superiorName',
                fixed: 'left',
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
                                    title: `${!(text as boolean) ? '启用' : '禁用'}用户[${
                                        record.username
                                    }]`,
                                    onOk: () => {
                                        this.setState({ loading: true });
                                        setUserEnabled({ id: record.id }).then((data) => {
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
        ];
        if (auth.admin || auth.superAdmin){
            this.columns.push({
                title: '管理员',
                dataIndex: 'admin',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    return (
                        <Switch
                            checked={text}
                            onChange={() => {
                                return Modal.confirm({
                                    mask: true,
                                    title: `${!(text as boolean) ? '赋予管理员权限给' : '取消管理员权限'} 用户[${
                                        record.username
                                    }]`,
                                    onOk: () => {
                                        this.setState({ loading: true });
                                        setUserAdmin({ id: record.id }).then((data) => {
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
            });
        }
        if (auth.superAdmin) {
            this.columns.push({
                title: '超级管理员',
                dataIndex: 'superAdmin',
                width: 180,
                render: (text: any, record: any, index: Number) => {
                    return (
                        <Switch
                            checked={text}
                            onChange={() => {
                                return Modal.confirm({
                                    mask: true,
                                    title: `${!(text as boolean) ? '赋予管理员权限给' : '取消管理员权限'} 用户[${
                                        record.username
                                    }]`,
                                    onOk: () => {
                                        this.setState({ loading: true });
                                        setUserSuper({ id: record.id }).then((data) => {
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
            });
        }
        this.columns.push({
            title: '备注',
            dataIndex: 'remark',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return <span>{text}</span>;
            },
        });
        this.columns.push({
            title: '最后上线IP',
            dataIndex: 'ip',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return <span>{text}</span>;
            },
        });
        this.columns.push({
            title: '最后上线域名',
            dataIndex: 'serverName',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                return <span>{text}</span>;
            },
        });
        this.columns.push({
            title: '最后上线时间',
            dataIndex: 'loginTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        });
        // this.columns.push({
        //     title: '角色名',
        //     dataIndex: 'rolesId',
        //     width: 180,
        //     render: (text: any, record: any, index: Number) => {
        //         return <span>{this.switchRoles(text)}</span>;
        //     },
        // });
        this.columns.push({
            title: '添加时间',
            dataIndex: 'addTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        });
        this.columns.push({
            title: '更新时间',
            dataIndex: 'updateTime',
            width: 180,
            render: (text: any, record: any, index: Number) => {
                if (text > 0) return moment(text).format('YYYY-MM-DD HH:mm:ss');
            },
        });
        this.columns.push({
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (text: any, record: any, index: Number) => {
                // console.log(record);
                return (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            disabled={record.status as boolean}
                            style={{ color: 'gray' }}
                            onClick={() => {
                                this.setState({ record: { ...record}, showModal: true})
                            }}
                        >
                            修改信息
                        </Button>
                        <Button
                            disabled={record.status as boolean}
                            style={{ color: 'red' }}
                            onClick={() => this.onChangePassword(record)}
                        >
                            重置密码
                        </Button>
                    </div>
                );
            },
        });
        this.start();
    }
    onSelectChange = (selectedRowKeys: string[]) => {
        this.setState({ selectedRowKeys });
    };
    start = () => {
        this.setState({ loading: true });
        getUser({
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
    restRecord() {
        this.setState({ record: {} });
    }
    onAdd() {
        if ((this.state.auth as any).superAdmin || (this.state.auth as any).admin) this.setState({ showModal: true, record: {} });
    }
    onChangeInput(key: string, value: any) {
        let record = this.state.record;
        (record as any)[key] = value;
        this.setState({ record });
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
                setUserDeleteAll(this.state.selectedRowKeys).then((_) => {
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
    onModalCancel(event: any) {
        this.setState({ showModal: false });
        this.restRecord();
    }
    async onModalOk(event: any) {
        this.setState({ showModalLoading: true });
        Modal.confirm({
            mask: true,
            style: {
                margin: '30vh auto',
            },
            title: `是否${(this.state.record as any).id !== undefined?'修改':'添加'}${(this.state.record as any).username} 为：${
                (this.state.record as any).superAdmin
                    ? '超级管理员'
                    : (this.state.record as any).admin
                    ? '管理员'
                    : '普通用户'
            }?`,
            content: '',
            onOk: () => {
                let record = this.state.record;
                setUserAdd(record).then((value: any) => {
                    // console.log(value);
                    if (value !== null) {
                        const { password } = value;
                        const { data } = this.state;
                        this.setState({ data: [] });
                        const index = data.findIndex((v: any) => v.id === value.id);
                        if (index > -1){
                            data.splice(index, 1,(value as never));
                        }else {
                            data.unshift(value as never);
                            this.showPasswordResult(password);
                        }
                        this.setState({ data: data });
                    }
                    this.setState({ showModalLoading: false, showModal: false });
                });
            },
            onCancel: () => {
                this.setState({ showModalLoading: false, showModal: false });
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
                <BreadcrumbCustom breads={['用户管理', '所有用户']} />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="所有用户" bordered={false}>
                                <Modal
                                    title="用户信息"
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
                                    <div style={{ display: 'flex' }}>
                                        <div
                                            style={{
                                                justifyContent: 'flex-center',
                                                alignItems: 'center',
                                                margin: '6px',
                                                width: '50%',
                                            }}
                                        >
                                            <span>用户名:</span>
                                            <Input
                                                value={(this.state.record as any).username}
                                                placeholder="登录用户名"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('username', e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                justifyContent: 'flex-center',
                                                alignItems: 'center',
                                                margin: '6px',
                                                width: '50%',
                                            }}
                                        >
                                            <span>备注:</span>
                                            <Input
                                                value={(this.state.record as any).remark}
                                                placeholder="备注"
                                                onChange={(e: any) => {
                                                    this.onChangeInput('remark', e.target.value);
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
                                                width: '35%',
                                            }}
                                        >
                                            <span>是否管理员:</span>
                                            <p />
                                            <Switch
                                                disabled={!(this.state.auth as any).superAdmin || !(this.state.auth as any).admin}
                                                checked={(this.state.record as any).admin}
                                                onChange={(e) => {
                                                    const { record } = this.state;
                                                    (record as any).admin = e;
                                                    if (e) {
                                                        (record as any).superAdmin = false;
                                                    }
                                                    this.setState({
                                                        record: { ...record },
                                                    });
                                                }}
                                            />
                                        </div>
                                        { (this.state.auth as any).superAdmin && (
                                            <div
                                                style={{
                                                    margin: '9px 6px',
                                                    justifyContent: 'fix-center',
                                                    alignItems: 'center',
                                                    width: '35%',
                                                }}
                                            >
                                                <span>是否超级管理员:</span>
                                                <p />
                                                <Switch
                                                    disabled={!(this.state.auth as any).superAdmin}
                                                    checked={(this.state.record as any).superAdmin}
                                                    onChange={(e) => {
                                                        const { record } = this.state;
                                                        (record as any).superAdmin = e;
                                                        if (e) {
                                                            (record as any).admin = false;
                                                        }
                                                        this.setState({
                                                            record: { ...record },
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                                width: '35%',
                                            }}
                                        >
                                            <span>是否启用:</span>
                                            <p />
                                            <Switch
                                                checked={(this.state.record as any).enabled}
                                                onChange={(e) => this.onChangeInput('enabled', e)}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                        }}
                                    >
                                        <div
                                            style={{
                                                margin: '9px 6px',
                                                justifyContent: 'fix-center',
                                                alignItems: 'center',
                                                width: '35%',
                                            }}
                                        >
                                            <span style={{ marginRight: '3px' }}>权限角色:</span>
                                            <Select
                                                value={(this.state.record as any).rolesId}
                                                style={{ width: 120, marginRight: 10 }}
                                                onChange={(val: any) => {
                                                    // notification.config({
                                                    //     placement: val,
                                                    // });
                                                    this.onChangeInput('rolesId', val);
                                                }}
                                            >
                                                {this.roles.map((item: any, index: number) => (
                                                    <Option key={index} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                    <p>
                                        用户编号:{(this.state.record as any).id}
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
                                        placeholder="搜索用户名"
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
                                    {((this.state.auth as any).admin || (this.state.auth as any).superAdmin) && (
                                        <Button
                                            type="primary"
                                            onClick={this.onAdd.bind(this)}
                                            disabled={loading}
                                            loading={loading}
                                        >
                                            添加用户
                                        </Button>
                                    )}
                                    {(this.state.auth as any).superAdmin && (
                                        <>
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
export default UserList;
