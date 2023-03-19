import { request } from 'undici'
import cheerio from 'cheerio'


const getSelector = (i, j) => `#summary_table_container > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`
const checkAvg = (i, j) => `#summary_table_container > table > tbody > tr:nth-child(${i}) > td:nth-child(${j}) > a`

const parseCookie = (string) => {
    const cookies = {};
    if (string) {
        string.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            const name = parts.shift().trim();
            const value = decodeURIComponent(parts.join('='));
            cookies[name] = value;
        });
    };
    return cookies;
};

const prepareCookie = (cookie) => {
    let str = [];
    for (let key in cookie) {
        str.push(`${key}=${cookie[key]}`);
    }
    return str.join("; ");
};

const getCookie = async (login, password) => {
    const {
        headers,
    } = await request("https://sosh1.dnevnik.anadyrobr.ru", {
        method: "POST",
        headers: {
            "User-Agent": "PostmanRuntime/7.31.1",
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        },
        body: `version=0&base=studium2&login=${login}&password=${password}&task=login&option=com_dnevnik`
    });
    return parseCookie(headers["set-cookie"] || "") || {};
};


export default async(username, password) => {
    try {
        const {
            body,
            statusCode
        } = await request("https://sosh1.dnevnik.anadyrobr.ru/index.php?option=com_dnevnik&controller=dnevnik&task=dnevnik", {
            method: "GET",
            headers: {
                "User-Agent": "PostmanRuntime/7.31.1",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Cookie": prepareCookie(
                    await getCookie(
                        username, 
                        password
                    )
                )
            }
        });
        if (statusCode !== 200) return reject("Error")
    
        const html = await body.text()
        const $ = cheerio.load(html)

        const avg = $(`#week_summary > p > span:nth-child(2) > strong`).text()
        
        return avg
       
    } catch (e) {
        throw "Ошибка. Проверьте и измените, если они не верны, данные авторизации"
    }
}