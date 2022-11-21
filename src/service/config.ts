/**
 * Created by 叶子 on 2017/7/30.
 * 接口地址配置文件
 */

//easy-mock模拟数据接口地址
// const MOCK_API = 'http://localhost:8080/admin/api';
const BASE_API = process.env.REACT_APP_BASE_URL;
// const MOCK_API = 'https://react-admin-mock.vercel.app/api';
export const SERVER_AUTH = BASE_API + '/login'; // 登录接口
/** 服务端异步菜单接口 */
export const SERVER_MENU = BASE_API + '/menu';
export const SERVER_BASIC_ORDER = BASE_API + '/basicOrder/list';
export const SERVER_COMPONENT_ORDER = BASE_API + '/completedOrder/list';
export const SERVER_PROCESSED_ORDER = BASE_API + '/processedOrder/list';
export const SERVER_BASIC_ORDER_CONFIRM = BASE_API + '/basicOrder/confirm';
export const SERVER_BASIC_ORDER_CLEAN = BASE_API + '/basicOrder/clean';
export const SERVER_CHANNEL_LIST = BASE_API + '/channel/list';
export const SERVER_CHANNEL_ENABLE = BASE_API + '/channel/enable';
export const SERVER_CHANNEL_CHANGE = BASE_API + '/channel/change';
export const SERVER_CHANNEL_ADD = BASE_API + '/channel/add';
export const SERVER_CHANNEL_REMOVE = BASE_API + '/channel/remove';
export const SERVER_USER_LIST = BASE_API + '/user/list';
export const SERVER_USER_ENABLE = BASE_API + '/user/enable';
export const SERVER_USER_CHANGE = BASE_API + '/user/change';
export const SERVER_USER_ADMIN = BASE_API + '/user/admin';
export const SERVER_USER_SUPER = BASE_API + '/user/super';
export const SERVER_USER_ADD = BASE_API + '/user/add';
export const SERVER_USER_REMOVE = BASE_API + '/user/remove';
export const SERVER_USER_REMARK = BASE_API + '/user/remark';
export const SERVER_USER_LOGOUT = BASE_API + '/user/logout';
export const SERVER_CLIENT_LIST = BASE_API + '/client/list';
export const SERVER_CLIENT_ADD = BASE_API + '/client/add';
export const SERVER_CLIENT_REMOVE = BASE_API + '/client/remove';
export const SERVER_SHORT_LINK_LIST = BASE_API + '/shortLink/list';
export const SERVER_SHORT_LINK_REMOVE = BASE_API + '/shortLink/remove';
// github授权
export const GIT_OAUTH = 'https://github.com/login/oauth';
// github用户
export const GIT_USER = 'https://api.github.com/user';

// bbc top news
export const NEWS_BBC =
    'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=429904aa01f54a39a278a406acf50070';
