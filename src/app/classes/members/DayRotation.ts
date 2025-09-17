import { Member } from "./Member";
import { Dates } from "./Dates";
import { Rotation, RotationTypes } from "./Rotation";
import { MemberType } from "../MemberData";

export class DayRotation extends Rotation{
    constructor(memberType:MemberType=MemberType.ACOLYTE) {
        super(memberType)
        this.rotationType = RotationTypes.DAYS
        
    }

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