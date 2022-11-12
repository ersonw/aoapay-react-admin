/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { PwaInstaller } from '../widget';
import { useAlita } from 'redux-alita';
import { RouteComponentProps } from 'react-router';
import { FormProps } from 'antd/lib/form';
import umbrella from 'umbrella-storage';
import {
    // GithubOutlined,
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';

const FormItem = Form.Item;
type LoginProps = {
    setAlitaState: (param: any) => void;
    auth: any;
} & RouteComponentProps &
    FormProps;

const Login = (props: LoginProps) => {
    const { history } = props;
    const [auth, setAlita] = useAlita({ auth: {} }, { light: true });

    useEffect(() => {
        setAlita('auth', null);
    }, [setAlita]);

    useUpdateEffect(() => {
        if (auth) {
            // 判断是否登陆
            umbrella.setLocalStorage('user', auth);
            history.push('/');
        }
    }, [history, auth]);

    const handleSubmit = (values: any) => {
        setAlita({ funcName: 'login', params: values, stateName: 'auth' });
    };
    // const gitHub = () => {
    //     window.location.href =
    //         'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    // };

    return (
        <div className="login">
            <div className="login-form">
                <div className="login-logo">
                    <span>AOA支付管理后台</span>
                    <PwaInstaller />
                </div>
                <Form onFinish={handleSubmit} style={{ maxWidth: '300px' }}>
                    <FormItem
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input prefix={<UserOutlined size={13} />} placeholder="管理账号" />
                    </FormItem>
                    <FormItem name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                        <Input
                            prefix={<LockOutlined size={13} />}
                            type="password"
                            placeholder="管理密码"
                        />
                    </FormItem>
                    <FormItem>
                        <span className="login-form-forgot" style={{ float: 'right' }}>
                            忘记密码
                        </span>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            style={{ width: '100%' }}
                        >
                            登录
                        </Button>
                        {/*<p style={{ display: 'flex', justifyContent: 'space-between' }}>*/}
                        {/*    <span>或 现在就去注册!</span>*/}
                        {/*    <span onClick={gitHub}>*/}
                        {/*        <GithubOutlined />*/}
                        {/*        (第三方登录)*/}
                        {/*    </span>*/}
                        {/*</p>*/}
                    </FormItem>
                </Form>
            </div>
        </div>
    );
};

export default Login;
