import { Availability, AvailabilityTypes } from "./Availability";
import { Dates } from "../Dates";

export class DayAvailability extends Availability{
    constructor() {
            super()
            this.setAvailabilityType(AvailabilityTypes.DAYS)
        }
    
    public setAvailable(weekend:string, day:string, available:boolean): void {
        this.getMap()[weekend][day] = available
    }

    public isAvailable(weekend:string,day:string): boolean {
        return this.getMap()[weekend][day]
    }
    
    public static fromJSON(json:string):Availability {
        let obj = JSON.parse(json)
        let availability:DayAvailability = new DayAvailability()

        availability.setId(obj.id)
        availability.setMap(obj.map)
        availability.setMemberType(obj.memberType)
        availability.setMemberId(obj.memberId)
        
        return availability
    }
    
    public setDayAvailable(weekend:string,day:string, available: boolean): void {
        
    }

    updateMap(): void {
        let availability:object = {}
                let curMap:object = this.getMap()
        
                Dates.weekends.forEach(weekend => {
                    Dates.days.forEach(day => {
                        if(availability[weekend] == undefined) availability[weekend] = {}
                        availability[weekend][day] = (
                            curMap[weekend] != undefined && 
                            curMap[weekend][day] != undefined) ? curMap[weekend][day] : true
                    })
                })
        
                this.setMap(availability)
    }

    public isDayAvailable(weekend: string,day:string): boolean {
        return this.getMap()[weekend][day]
    }
}