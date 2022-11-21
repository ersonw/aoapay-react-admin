import React from "react";
import BreadcrumbCustom from "../components/widget/BreadcrumbCustom";
import {Button, Card, Col, Input, message, Row, Switch} from "antd";
import {setUserLogout,setUserRemark} from "../service";
import umbrella from 'umbrella-storage';
class UserInfo extends React.Component {
    state = {auth: {}};
    componentDidMount() {
        const { auth, query } = (this.props as any);
        this.setState({auth,query,})
    }
    save() {
        message.error('暂不支持保存资料');
        // setUserRemark({remark: (this.state as any).auth.remark}).then((data:any)=>{
        //
        // });
    }
    logout() {
        setUserLogout().then(() => {
            window.location.href ="/#/login";
        })
    }
    render() {
        const { auth } = (this.state as any);
        return (
            <div className="gutter-example">
                <BreadcrumbCustom breads={['个人资料']} />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="个人资料" bordered={false}>
                                <div style={{ display: 'flex' }}>
                                    <div
                                        style={{
                                            margin: '9px 6px',
                                            justifyContent: 'fix-center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        登录名:<Input value={auth.username} disabled />
                                    </div>
                                    {/*<div*/}
                                    {/*    style={{*/}
                                    {/*        margin: '9px 6px',*/}
                                    {/*        justifyContent: 'fix-center',*/}
                                    {/*        alignItems: 'center',*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    备注：<Input value={auth.remark} onChange={(e)=>{*/}
                                    {/*        this.setState({auth:{...auth,remark:e.target.value}});*/}
                                    {/*}} disabled />*/}
                                    {/*</div>*/}
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
                                            disabled
                                            checked={auth.admin}
                                        />
                                    </div>
                                    { auth.superAdmin && (
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
                                                disabled
                                                checked={auth.superAdmin}
                                            />
                                        </div>
                                    )}
                                </div>
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
                                        disabled
                                        checked={auth.enabled}
                                    />
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
                                        <Button type="primary" onClick={this.logout.bind(this)} danger>注销登录/切换账号</Button>
                                    </div>
                                    <div
                                        style={{
                                            margin: '9px 6px',
                                            justifyContent: 'fix-center',
                                            alignItems: 'center',
                                            width: '35%',
                                        }}
                                    >
                                        <Button type="primary" onClick={this.save.bind(this)}>保存修改</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default UserInfo;
