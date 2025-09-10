import { Availability } from "./Availability";
import { Dates } from "./Dates";

export class DayAvailability extends Availability{
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