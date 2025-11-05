import { Dates } from "../classes/dates/Dates";
import {DayRotation} from "../classes/members/rotation/DayRotation"


test('update DayRotation map', () => {
    let rot:DayRotation = new DayRotation()
    Dates.setDaysToDefault()
    Dates.setWeekendsToDefault()
    rot.updateMap()
    expect(rot.getMap()).toEqual({
        "1º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "2º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "3º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "4º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "5º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
    })
});

test("update existing DayRotation map",() => {
    let rot = new DayRotation()
    rot.setMap({
        "1º":{"Sábado - 19h":10,"Domingo - 08h":3,"Domingo - 19h":9},
        "2º":{"Sábado - 19h":5,"Domingo - 08h":2,"Domingo - 19h":3},
        "5º":{"Sábado - 19h":5,"Domingo - 08h":7,"Domingo - 19h":7},
        "6º":{"Sábado - 19h":5,"Domingo - 08h":7,"Domingo - 19h":7}
    })

    rot.updateMap()
    expect(rot.getMap()).toEqual({
        "1º":{"Sábado - 19h":10,"Domingo - 08h":3,"Domingo - 19h":9},
        "2º":{"Sábado - 19h":5,"Domingo - 08h":2,"Domingo - 19h":3},
        "3º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "4º":{"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0},
        "5º":{"Sábado - 19h":5,"Domingo - 08h":7,"Domingo - 19h":7}
    })
})