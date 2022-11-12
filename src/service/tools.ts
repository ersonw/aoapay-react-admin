/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import axios from 'axios';
import { message } from 'antd';

interface IFRequestParam {
    url: string;
    msg?: string;
    config?: any;
    data?: any;
}
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({ url, msg = '接口异常', config, data }: IFRequestParam) => {
    const token = getCookie('token');
    if (config === undefined) {
        config = { headers: {} };
    }
    config.headers.Token = token;
    if (typeof data === 'object') {
        let queryParams = '?';
        for (const key in data) {
            if ((data as any)[key] !== undefined)
                queryParams = `${queryParams}${key}=${(data as any)[key]}&`;
        }
        url += queryParams.substring(0, queryParams.length - 1);
    }
    return axios
        .get(url, config)
        .then((res) => {
            if (res.data.message !== undefined && res.data.message !== null) {
                if (res.data.code === 200) {
                    message.success(res.data.message);
                } else if (res.data.code === 201) {
                    setCookie('token', '');
                } else {
                    message.error(res.data.message);
                    throw new Error(res.data.code);
                }
            }
            return res.data.data;
        })
        .catch((err) => {
            console.log(err);
            // message.warn(msg);
            throw new Error(err);
        });
};

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({ url, data, msg = '接口异常', config }: IFRequestParam) => {
    const token = getCookie('token');
    if (config === undefined) {
        config = { headers: {} };
    }
    config.headers.Token = token;
    return axios
        .post(url, data, config)
        .then((res) => {
            if (res.data.message !== undefined && res.data.message !== null) {
                if (res.data.code === 200) {
                    message.success(res.data.message);
                } else if (res.data.code === 201) {
                    message.error(res.data.message);
                    setCookie('token', '');
                } else {
                    message.error(res.data.message);
                    throw new Error(res.data.code);
                }
            }
            return res.data.data;
        })
        .catch((err) => {
            console.log(err);
            throw new Error(err);
            // message.warn(msg);
        });
};
/**
 *
 * @param key            就是key
 * @param value          就是value
 * @param time:number    以毫秒的形式设置过期时间         ===》3000
 * @param time:string    以时间字符的形式设置过期时间    ===》Sat, 13 Mar 2017 12:25:57 GMT
 * @param time:Date      以Date设置过期时间             ===》new Date(2017, 03, 12)
 *
 * @param defaultTime     如果没有时间参数，设置默认过期时间 单位毫秒
 */

const defaultTime = 86400000;
//设置cookie
export function setCookie(key: string, value: string, time?: number | Date) {
    let invalid = new Date();
    if (time) {
        switch (typeof time) {
            case 'number':
                invalid.setTime(invalid.getTime() + time);
                break;
            default:
                invalid = time;
        }
    } else {
        invalid.setTime(invalid.getTime() + defaultTime);
    }
    //字符串拼接cookie
    window.document.cookie = key + '=' + value + ';path=/;expires=' + invalid.toUTCString();
}

//读取cookie
export function getCookie(param: string) {
    var c_param = '';
    if (document.cookie.length > 0) {
        var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('='); //再次切割
            //判断查找相对应的值
            if (arr2[0] === param) {
                c_param = arr2[1];
                //保存到保存数据的地方
            }
        }
        return c_param;
    }
}
