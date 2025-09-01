import { MemberType } from "../MemberData";
import { Dates } from "./Dates";
import { Roles } from "./Roles";
import { Rotation } from "./Rotation";

export class DayRotation extends Rotation{
    updateMap(): void {
        let rotation:object = {}
        let curMap:object = this.getMap()

        Dates.weekends.forEach(weekend => {
            Dates.days.forEach(day => {
                if(rotation[weekend] == undefined) rotation[weekend] = {}
                rotation[weekend][day] = (
                    curMap[weekend] != undefined && 
                    curMap[weekend][day] != undefined) ? curMap[weekend][day] : 0
            })
        })

        this.setMap(rotation)
    }
}