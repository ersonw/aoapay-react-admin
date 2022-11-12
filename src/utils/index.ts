/**
 * Created by hao.cheng on 2017/4/28.
 */
import queryString from 'query-string';
import { getCookie } from '../service/tools';
/**
 * 获取URL参数
 */
export function parseQuery() {
    return queryString.parseUrl(window.location.href).query;
}

/**
 * 校验是否登录
 * @param permits
 */
export const checkLogin = (permits: any): boolean => {
    // console.log(getCookie('token') === '');
    // console.log(permits);
    return getCookie('token') !== undefined || getCookie('token') !== '' || !!permits;
};
// || !!permits;
// (process.env.NODE_ENV === 'production' && !!permits) || process.env.NODE_ENV === 'development';
