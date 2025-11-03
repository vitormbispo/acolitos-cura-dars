import { MemberData } from "../MemberData"
import { Member } from "../members/Member"
import { RoleSet } from "../roles/RoleSet"
import { Lineup } from "./Lineup"
import { SerializedLineup, SerializedMember } from "./SerializedLineup"

export class LineupConversion {
    public static Serialize(lineup:Lineup):SerializedLineup {
        let serialized:SerializedLineup = new SerializedLineup()
        serialized.name = `${lineup.weekend} ${lineup.day}`
        serialized.day = lineup.day
        serialized.weekend = lineup.weekend
        serialized.place = lineup.place

        lineup.roleset.set.forEach((role) => {
            const member = lineup.GetRoleMember(role)
            const name = member != undefined ? member.nick : "-- Sem escala --"

            serialized.AssignRole(role,{name:name,id:member != undefined ? member.id : -1})
        })
        return serialized
    }
    
    public static Deserialize(lineup:SerializedLineup):Lineup {
        let newLineup = new Lineup(null,lineup.day,lineup.weekend,lineup.place)
        let newRoleSet = new RoleSet(lineup.name,lineup.type)
        newLineup.roleset = newRoleSet

        Object.keys(lineup.line).forEach((role) => {
            let serialized:SerializedMember = lineup.line[role]
            let foundMember:Member = MemberData.FindMemberById(serialized.id)
            newLineup.roleset.AddRole(role)

            if(foundMember == undefined) {
                let newMember = new Member(serialized.type,serialized.name,serialized.name)
                newLineup.AssignRole(role,newMember)
            } else {
                newLineup.AssignRole(role,foundMember)
            }
        })
        
        newLineup.roleset = newRoleSet
        return newLineup
    }
}