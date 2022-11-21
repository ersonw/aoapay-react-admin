/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post, setCookie } from './tools';
import * as config from './config';
import { Md5 } from 'ts-md5';

export const getBbcNews = () => get({ url: config.NEWS_BBC });

export const npmDependencies = () =>
    axios
        .get('./npm.json')
        .then((res) => res.data)
        .catch((err) => console.log(err));

export const weibo = () =>
    axios
        .get('./weibo.json')
        .then((res) => res.data)
        .catch((err) => console.log(err));

export const gitOauthLogin = () =>
    get({
        url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`,
    });
export const gitOauthToken = (code: string) =>
    post({
        url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
        data: {
            client_id: '792cdcd244e98dcd2dee',
            client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
            redirect_uri: 'http://localhost:3006/',
            state: 'reactAdmin',
            code,
        },
    });
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = (access_token: string) =>
    get({ url: `${config.GIT_USER}access_token=${access_token}` });

export const login = async ({ username, password }: any) => {
    try {
        const data = await post({
            url: config.SERVER_AUTH,
            data: { username, password: Md5.hashStr(password) },
        });
        const { token } = data;
        setCookie('token', token);
        return data;
    } catch (e) {
        // console.log(e.message);
        // throw new Error(e);
    }
};
/** 获取服务端菜单 */
export const fetchMenu = async () => {
    try {
        const { list } = await get({ url: config.SERVER_MENU });
        if (list) {
            return list;
        }
    } catch (e) {}
    return [];
};
export const getShortLink = async ({ title, page, limit }: any) => {
    try {
        return await get({ url: config.SERVER_SHORT_LINK_LIST, data: { title, page, limit } });
    } catch (e) {
        return { list: [], total: 0 };
    }
};
export const setShortLinkDeleteAll = async (ids: any) => {
    try {
        return await post({ url: config.SERVER_SHORT_LINK_REMOVE, data: { ids } });
    } catch (e) {
        return [];
    }
};
export const setShortLinkDelete = async ({ id }: any) => {
    try {
        return await get({ url: config.SERVER_SHORT_LINK_REMOVE, data: { id } });
    } catch (e) {
        return null;
    }
};
export const getClient = async ({ title, page, limit }: any) => {
    try {
        return await get({ url: config.SERVER_CLIENT_LIST, data: { title, page, limit } });
    } catch (e) {
        return { list: [], total: 0 };
    }
};
export const setClientAdd = async () => {
    try {
        return await get({ url: config.SERVER_CLIENT_ADD });
    } catch (e) {
        return null;
    }
};
export const setClientDeleteAll = async (ids: any) => {
    try {
        return await post({ url: config.SERVER_CLIENT_REMOVE, data: { ids } });
    } catch (e) {
        return [];
    }
};
export const setClientDelete = async ({ id }: any) => {
    try {
        return await get({ url: config.SERVER_CLIENT_REMOVE, data: { id } });
    } catch (e) {
        return null;
    }
};
export const getUser = async ({ title, page, limit }: any) => {
    try {
        return await get({ url: config.SERVER_USER_LIST, data: { title, page, limit } });
    } catch (e) {
        return { list: [], total: 0 };
    }
};
export const setUserEnabled = async ({ id }: any) => {
    try {
        return await get({ url: config.SERVER_USER_ENABLE, data: { id } });
    } catch (e) {
        return null;
    }
};
export const setUserChange = async (data: any) => {
    try {
        return await get({ url: config.SERVER_USER_CHANGE, data: data });
    } catch (e) {
        return null;
    }
};
export const setUserAdmin = async (data: any) => {
    try {
        return await get({ url: config.SERVER_USER_ADMIN, data: data });
    } catch (e) {
        return null;
    }
};
export const setUserSuper = async (data: any) => {
    try {
        return await get({ url: config.SERVER_USER_SUPER, data: data });
    } catch (e) {
        return null;
    }
};
export const setUserAdd = async (data: any) => {
    try {
        return await post({ url: config.SERVER_USER_ADD, data: data });
    } catch (e) {
        return null;
    }
};
export const setUserRemark = async (data: any) => {
    try {
        return await post({ url: config.SERVER_USER_REMARK, data: data });
    } catch (e) {
        return null;
    }
};
export const setUserLogout = async () => {
    try {
        return await get({ url: config.SERVER_USER_LOGOUT, });
    } catch (e) {
        return null;
    }
};
export const setUserDeleteAll = async (ids: any) => {
    try {
        return await post({ url: config.SERVER_USER_REMOVE, data: { ids } });
    } catch (e) {
        return [];
    }
};
export const getChannel = async ({ title, page, limit }: any) => {
    try {
        return await get({ url: config.SERVER_CHANNEL_LIST, data: { title, page, limit } });
    } catch (e) {
        return { list: [], total: 0 };
    }
};
export const setChannelEnabled = async ({ id }: any) => {
    try {
        return await get({ url: config.SERVER_CHANNEL_ENABLE, data: { id } });
    } catch (e) {
        return null;
    }
};
export const setChannelEnabledAll = async (ids: any) => {
    try {
        return await post({ url: config.SERVER_CHANNEL_ENABLE, data: { ids } });
    } catch (e) {
        return [];
    }
};
export const setChannelChange = async (data: any) => {
    try {
        return await post({ url: config.SERVER_CHANNEL_CHANGE, data: data });
    } catch (e) {
        return null;
    }
};
export const setChannelAdd = async (data: any) => {
    try {
        return await post({ url: config.SERVER_CHANNEL_ADD, data: data });
    } catch (e) {
        return null;
    }
};
export const setChannelDeleteAll = async (ids: any) => {
    try {
        return await post({ url: config.SERVER_CHANNEL_REMOVE, data: { ids } });
    } catch (e) {
        return [];
    }
};
export const getBasicOrder = async (data: any) => {
    try {
        return await get({ url: config.SERVER_BASIC_ORDER, data: data });
    } catch (e) {
        return { list: [], total: 0 };
    }
};
export const getCompletedOrder = async (data: any) => {
    try {
        return await get({ url: config.SERVER_COMPONENT_ORDER, data: data });
    } catch (e) {
        return { list: [], total: 0,count: 0, };
    }
};
export const getProcessedOrder = async (data: any) => {
    try {
        return await get({ url: config.SERVER_PROCESSED_ORDER, data: data });
    } catch (e) {
        return { list: [], total: 0, count: 0, };
    }
};
export const confirmBasicOrder = async ({ id }: any) => {
    try {
        return await post({
            url: config.SERVER_BASIC_ORDER_CONFIRM,
            data: { id },
        });
    } catch (e) {
        return null;
    }
};
export const OrderClean = async () => {
    try {
        return await post({
            url: config.SERVER_BASIC_ORDER_CLEAN,
        });
    } catch (e) {
        return null;
    }
};
