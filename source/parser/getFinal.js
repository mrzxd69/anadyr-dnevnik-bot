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
        } = await request("https://sosh1.dnevnik.anadyrobr.ru/index.php?option=com_dnevnik&controller=dnevnik&task=summary", {
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
        let res
        for (let i = 3; i <= 19; i++) {
            for (let j = 2; j <= 9; j++) {
                res += $(checkAvg(i, j))[0]?.attribs?.['data-avg'] ? `<b>${$(checkAvg(i, j))[0]?.attribs?.['data-avg'].replace('(', '').replace(')', '')}${j == 9 ? `\n` : ` `}</b>` : `${$(getSelector(i, j)).text().replaceAll(/\s\s/g, " ")}${j == 9 ? `\n` : ` `}`
            }
        }
    
        const rows = [];
        let maxSubjectLength = 0;
    
        res = res
            .replace('undefined', '')
            .replace('Физическая культура', 'Физ-ра')
            .replace('Разговоры о важном', '')
            .replace('Обществознание', 'Общество')
            .replace('Английский язык', 'Англ.Язык')
            .replace('Родной язык', 'Родн.Язык ')
            .replace('Русский язык', 'Рус.Язык')
    
        res.split('\n').forEach((row) => {
            const [subject, ...grades] = row.trim().split(/\s+/);
            maxSubjectLength = Math.max(maxSubjectLength, subject.length);
            rows.push({ subject, grades });
        })
    
    
        const alignedRows = rows.map(({ subject, grades }) => {
            const paddedSubject = subject.padEnd(maxSubjectLength);
            const grade = grades.pop();
            const paddedGrade = grade ? grade.padStart(4) : '';
            return `${paddedSubject} ${grades.join('  ')} ${paddedGrade}`;
        })
    
        return alignedRows.join('\n')
    } catch (e) {
        throw "При получении данных произошла ошибка. Пожалуйста, проверьте данные авторизации. Если данные не верны - выйдите из аккаунта и заново авторизуйтесь"
    }
}