import { Dates } from "./Dates";
import { MemberType } from "./MemberType";
import { Rotation, RotationTypes } from "./Rotation";

export class DayRotation extends Rotation{
    constructor(memberType:MemberType=MemberType.ACOLYTE) {
        super(memberType)
        this.rotationType = RotationTypes.DAYS
        
    }

    public setRotation(day:string,value:number=0) {
        this.map[day] = value
    }

    public getRotation(day:string): number{
        return this.map[day]
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