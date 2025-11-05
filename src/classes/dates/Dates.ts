import { DateSet } from "./DatesSet"

export class Dates {
    public static readonly DEFAULT_DAYS:Array<string> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    public static readonly DEFAULT_WEEKENDS:Array<string> = ["1º","2º","3º","4º","5º"]

    public static days:Array<string> = this.DEFAULT_DAYS
    public static weekends:Array<string> = this.DEFAULT_WEEKENDS

    /**
     * Adiciona um novo dia
     * @param day 
     */
    public static addDay(day:string):void {
        this.days.push(day)
    }

    /**
     * Remove um dia
     * @param day 
     * @returns 
     */
    public static removeDay(day:string):boolean {
        let index:number = this.days.indexOf(day)
        if(index == -1) return false
        
        this.days.splice(index,1)
        return true
    }

    /**
     * Adiciona um fim de semana
     * @param weekend 
     */
    public static addWeekend(weekend:string):void {
        this.weekends.push(weekend)
    }

    /**
     * Remove um fim de semana
     * @param weekend 
     * @returns 
     */
    public static removeWeekend(weekend:string):boolean {
        let index:number = this.weekends.indexOf(weekend)
        if(index == -1) return false
        
        this.weekends.splice(index,1)
        return true
    }

    /**
     * Retorna os dias ao padrão
     */
    public static setDaysToDefault():void {
        this.days = this.DEFAULT_DAYS
    }

    /**
     * Retorna os fins de semana ao padrão
     */
    public static setWeekendsToDefault():void {
        this.weekends = this.DEFAULT_WEEKENDS   
    }

    /**
    * Retorna o preset de um objeto que armazena os dias do mês no formato
    * "FimDeSemana":[Dia1,Dia2,Dia3]
    * @returns 
    */
    static DefaultMonthDays():object{
        let map = {}

        Dates.DEFAULT_WEEKENDS.forEach((weekend)=>{
            let days:Array<string> = []
            Dates.DEFAULT_DAYS.forEach((day)=>{
                days.push(day)
            })
            map[weekend] = days
        })

        return map
    }

    /**
     * Organiza uma lista de dias de acordo com a ordem de determinado DateSet
     * @param set DateSet
     * @param days Lista para organizar
     * @returns Lista organizada
     */
    static OrganizeDays(set:DateSet,days:Array<string>):Array<string>{
        let organized = []
        set.days.forEach((setDay)=>{
            days.forEach((day=>{
                if(setDay == day){
                    organized.push(day)
                }
            }))
        })
        return organized
    }

    /**
     * Organiza um mapa de fins de semana de acordo com a ordem de determinado DateSet
     * @param set 
     * @param weekendsMap 
     * @returns Objeto com os fins de semana organizados
     */
    static OrganizeWeekends(set:DateSet,weekendsMap:object){
        let organized = {}
        let keys = Object.keys(weekendsMap)
        set.weekends.forEach((setWeekend) => {
            keys.forEach((weekend)=>{
                if(setWeekend == weekend){
                    organized[weekend] = weekendsMap[weekend]
                }
            })
        })

        return organized

    }
}