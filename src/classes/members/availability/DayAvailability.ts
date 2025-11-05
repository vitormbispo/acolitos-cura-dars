import { Availability, AvailabilityTypes } from "./Availability";
import { Dates } from "../../dates/Dates";

export class DayAvailability extends Availability{
    constructor() {
            super()
            this.availabilityType = AvailabilityTypes.DAYS
        }
    
    public setAvailable(weekend:string, day:string, available:boolean): void {
        this.map[weekend][day] = available
    }

    public isAvailable(weekend:string,day:string): boolean {
        if(this.map[weekend][day] == undefined) {
            return true
        }
        return this.map[weekend][day]
    }
    
    /**
     * Cria um objeto `DayAvailability` a partir de um JSON
     * @param json JSON
     * @returns `DayAvailability` referente ao JSON
     */
    public static fromJSON(json:string):DayAvailability {
        let obj = JSON.parse(json)
        let availability:DayAvailability = new DayAvailability()

        availability.id = obj.id
        availability.map = obj.map
        availability.memberType = obj.memberType
        availability.memberID = obj.memberId
        
        return availability
    }
    

    updateMap(): void {
        let availability:object = {}
                let curMap:object = this.map
        
                Dates.weekends.forEach(weekend => {
                    Dates.days.forEach(day => {
                        if(availability[weekend] == undefined) availability[weekend] = {}
                        availability[weekend][day] = (
                            curMap[weekend] != undefined && 
                            curMap[weekend][day] != undefined) ? curMap[weekend][day] : true
                    })
                })
        
                this.map = availability
    }

    /**
     * Verifica a disponibilidade de um dia específico
     * @param weekend Fim de semana
     * @param day Dia
     * @returns `true` se houver disponibilidade
     */
    public isDayAvailable(weekend: string,day:string): boolean {
        return this.map[weekend][day]
    }
}