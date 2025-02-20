
export class Dates {
    static defaultWeekends = ["1º","2º","3º","4º"]
    static defaultDays = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]


    // TODO Corrigir um erro que esse método retorna um mapa usando cada letra do fim de semana como chave
    /**
    * Retorna o preset de um objeto que armazena os dias do mês no formato
    * "FimDeSemana":[Dia1,Dia2,Dia3]
    * @returns 
    */
    static DefaultMonthDays():object{
    let map = {}

    Dates.defaultWeekends.forEach((weekend)=>{
        let days:Array<string> = []
        Dates.defaultDays.forEach((day)=>{
            days.push(day)
        })
        map[weekend] = days
    })

    return map
}
}

export class DateSet {
    weekends = ["1º","2º","3º","4º"]
    days = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
}

