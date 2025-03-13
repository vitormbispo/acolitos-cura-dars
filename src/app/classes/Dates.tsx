//TODO Fazer função para atualizar os objetos de acordo com os dias e fins de semana padrão 
// caso eles sejam alterados em algum momento

/**
 * Armazena dados e métodos dos fins de semana e dias
 */
export class Dates {
    static defaultWeekends = ["1º","2º","3º","4º","5º"]
    static defaultDays = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]

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

/**
 * Conjunto de fins de semana e dias
 */
export class DateSet {
    weekends = ["1º","2º","3º","4º","5º"]
    days = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
}