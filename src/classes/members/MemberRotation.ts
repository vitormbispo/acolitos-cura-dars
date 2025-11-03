import { DayRotation } from "./DayRotation";
import { MemberType } from "./MemberType";
import { PlaceRotation } from "./PlaceRotation";
import { RoleRotation } from "./RoleRotation";
import { Rotation } from "./Rotation";

export class MemberRotation {
    private memberType:MemberType
    public dayRotation:DayRotation
    public placeRotation:Rotation
    public roleRotation:RoleRotation


    constructor(memberType:MemberType){
        this.memberType = memberType
        this.dayRotation = new DayRotation(memberType)
        this.placeRotation = new PlaceRotation(memberType)
        this.roleRotation = new RoleRotation(memberType)

        this.dayRotation.updateMap()
        this.roleRotation.updateMap()
        this.placeRotation.updateMap()
    }

    public asJSON():string {
            let obj:object = {
                "memberType":this.memberType,
                "dayRotation":this.dayRotation.asJSON(),
                "roleRotation":this.roleRotation.asJSON()
            }
            return JSON.stringify(obj)
        }
    
        public static fromJSON(json:string):MemberRotation {
            let obj = JSON.parse(json)
            let rotation = new MemberRotation(obj.memberType)

            rotation.dayRotation = DayRotation.fromJSON(obj.dayRotation)
            rotation.roleRotation = RoleRotation.fromJSON(obj.roleRotation)
    
            rotation.dayRotation.updateMap()
            rotation.roleRotation.updateMap()
    
            return rotation
        }
    
        public clone() {
            return MemberRotation.fromJSON(this.asJSON())
        }

}