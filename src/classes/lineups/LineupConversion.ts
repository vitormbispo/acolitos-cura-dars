import { MemberData } from "../MemberData"
import { Member } from "../members/Member"
import { RoleSet } from "../roles/RoleSet"
import { Lineup } from "./Lineup"
import { SerializedLineup, SerializedMember } from "./SerializedLineup"

/**
 * Conversão de escalas entre serializadas e normais
 */
export class LineupConversion {
    /**
     * Converte uma escala convencional em uma escala serializada
     * @param lineup Escala convencional
     * @returns Escala convertida a serializada
     */
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
    
    /**
     * Converte uma escala serializada em uma escala convencional
     * @param lineup Escala serializada
     * @returns Escala convertida a convencional
     */
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