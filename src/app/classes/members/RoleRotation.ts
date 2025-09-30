import { MemberType } from "../MemberData";
import { Rotation, RotationTypes } from "./Rotation";
import { RoleSet } from "../roles/RoleSet";

export class RoleRotation extends Rotation{
    constructor(memberType:MemberType) {
        super(memberType)
        this.rotationType = RotationTypes.ROLES
    }
    
    public setRotation(key:string,value:number=0) {
        this.map[key] = value
    }

    public getRotation(key:string): number {
        return this.map[key]
    }

    public static fromJSON(json:string):RoleRotation {
            let obj = JSON.parse(json)
            let availability:RoleRotation = new RoleRotation(obj.memberType)
    
            availability.setId(obj.id)
            availability.setMap(obj.map)
            availability.setMemberType(obj.memberType)
            availability.setRotationType(obj.rotationType)
            
            return availability
        }

    public updateMap(): void {
        let rotation:object = {}
        let curMap:object = this.getMap()
        let roles:Array<string>
        switch(this.getMemberType()) {
            case MemberType.ACOLYTE: roles = RoleSet.DEFAULT_ACOLYTE_ROLES; break
            case MemberType.COROINHA: roles = RoleSet.DEFAULT_COROINHA_ROLES; break
        }

        roles.forEach((role)=> {
            rotation[role] = Object.keys(curMap).includes(role) ? curMap[role] : 0
        })

        this.setMap(rotation)
    }
}