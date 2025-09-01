import { MemberType } from "../MemberData";
import { Roles } from "./Roles";
import { Rotation } from "./Rotation";

export class RoleRotation extends Rotation{
    updateMap(): void {
        let rotation:object = {}
        let curMap:object = this.getMap()
        let roles:Array<string>
        switch(this.getType()) {
            case MemberType.ACOLYTE: roles = Roles.DEFAULT_ACOLYTE_ROLES; break
            case MemberType.COROINHA: roles = Roles.DEFAULT_COROINHA_ROLES; break
        }

        roles.forEach((role)=> {
            rotation[role] = Object.keys(curMap).includes(role) ? curMap[role] : 0
        })

        this.setMap(rotation)
    }
}