import cheerio from 'cheerio'
import { request } from 'undici'
import postgresql from '#database/postgresql.js';

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

const days = {
    'Понедельник': 3,
    'Вторник': 5,
    'Среда': 7,
    'Четверг': 3,
    'Пятница': 5,
    'Суббота': 7
}

const weeks = {
    'Понедельник': "#week_left_inner",
    'Вторник': "#week_left_inner",
    'Среда': "#week_left_inner",
    'Четверг': "#week_right_inner",
    'Пятница': "#week_right_inner",
    'Суббота': "#week_right_inner"
}


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


export default async (username, password, day) => {
    console.log(username, password);
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
        })
        if (statusCode !== 200) return reject("Error")

        const html = await body.text()

        const $ = cheerio.load(html)
        let res

        for (let i = 2; i < 10; i++) {
            let currentRes = $(`${weeks[day]} > div:nth-child(${days[day]}) > table > tbody > tr:nth-child(${i}) > td:nth-child(2) > div > span.tt_state0`)
                .text()
            
            res += "<b>" + currentRes.slice(0, currentRes.length - 9) + "</b>" + ": "

            if(/Физическая культура/.test(currentRes)) break
            res += `<i> ${$(`${weeks[day]} > div:nth-child(${days[day]}) > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > div > div > span`)
                .text()}</i>`
        }

        const avg = $(`#week_summary > p > span:nth-child(2) > strong`).text()
        await postgresql(`UPDATE users SET avg = $1 WHERE login = $2 AND password = $3`, [
            Number(avg), username, password
        ])

        return res
            .replace('undefined', '')
            .replace(/:/, '')
    } catch (e) {
        console.log(e)
    }
}