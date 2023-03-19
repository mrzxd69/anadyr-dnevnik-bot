import { InlineKeyboard } from 'puregram'


export const menuKeyboard = () => InlineKeyboard.keyboard([
    [
        InlineKeyboard.textButton({
            text: "Домашнее задание",
            payload: "homework"
        }),
        InlineKeyboard.textButton({
            text: "Итоговые оценки",
            payload: "finalGrades"
        })
    ],
    [
        InlineKeyboard.textButton({
            text: "Рейтинг учеников",
            payload: "raiting"
        })
    ],
    [
        InlineKeyboard.textButton({
            text: "Выйти с аккаунта",
            payload: "logout"
        }), 
    ]
])


export const exitKeyboard = () => InlineKeyboard.keyboard([
    [
        InlineKeyboard.textButton({
            text: "Вернуться в меню",
            payload: "exit"
        }),
    ]
])


export const dayKeyboard = () => InlineKeyboard.keyboard([
    [
        InlineKeyboard.textButton({
            text: "ПН",
            payload: "Понедельник"
        }),
        InlineKeyboard.textButton({
            text: "ВТ",
            payload: "Вторник"
        }),
        InlineKeyboard.textButton({
            text: "СР",
            payload: "Среда"
        })
    ],
    [
        InlineKeyboard.textButton({
            text: "ЧТ",
            payload: "Четверг"
        }),
        InlineKeyboard.textButton({
            text: "ПТ",
            payload: "Пятница"
        }),
        InlineKeyboard.textButton({
            text: "СБ",
            payload: "Суббота"
        })
    ],
    [
        InlineKeyboard.textButton({
            text: "Вернуться в меню",
            payload: "exit"
        }),
    ]
])
