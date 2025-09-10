export class Dates {
    public static readonly DEFAULT_DAYS:Array<string> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    public static readonly DEFAULT_WEEKENDS:Array<string> = ["1º","2º","3º","4º","5º"]

    public static days:Array<string> = this.DEFAULT_DAYS
    public static weekends:Array<string> = this.DEFAULT_WEEKENDS

    public static addDay(day:string):void {
        this.days.push(day)
    }

    public static removeDay(day:string):boolean {
        let index:number = this.days.indexOf(day)
        if(index == -1) return false
        
        this.days.splice(index,1)
        return true
    }

    public static addWeekend(weekend:string):void {
        this.weekends.push(weekend)
    }

    public static removeWeekend(weekend:string):boolean {
        let index:number = this.weekends.indexOf(weekend)
        if(index == -1) return false
        
        this.weekends.splice(index,1)
        return true
    }

    public static setDaysToDefault():void {
        this.days = this.DEFAULT_DAYS
    }
    
    public static setWeekendsToDefault():void {
        this.weekends = this.DEFAULT_WEEKENDS   
    }
}