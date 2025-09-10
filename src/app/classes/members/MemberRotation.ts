import { DayRotation } from "./DayRotation";
import { Member } from "./Member";
import { RoleRotation } from "./RoleRotation";
import { Rotation } from "./Rotation";

export class MemberRotation {
    public dayRotation:DayRotation
    public placeRotation:Rotation
    public roleRotation:RoleRotation
    private memberRef:Member

    constructor(memberRef:Member){
        this.memberRef = memberRef
        this.dayRotation = new DayRotation(memberRef)
        //this.placeRotation = new Rotation()
        this.roleRotation = new RoleRotation(memberRef)

        this.dayRotation.updateMap()
        this.roleRotation.updateMap()
    }
}