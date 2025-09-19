import { Member } from "./Member";
import { Dates } from "./Dates";
import { Rotation, RotationTypes } from "./Rotation";
import { MemberType } from "../MemberData";

export class DayRotation extends Rotation{
    constructor(memberType:MemberType=MemberType.ACOLYTE) {
        super(memberType)
        this.rotationType = RotationTypes.DAYS
        
    }

    public setRotation(weekend:string,day:string,value:number=0) {
        this.map[weekend][day] = value
    }

    public getRotation(weekend:string,day:string): number{
        return this.map[weekend][day]
    }

    public static fromJSON(json:string):DayRotation {
            let obj = JSON.parse(json)
            let availability:DayRotation = new DayRotation()
    
            availability.setId(obj.id)
            availability.setMap(obj.map)
            availability.setMemberType(obj.memberType)
            
            return availability
        }

    public updateMap(): void {
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