import { MemberData, MemberType } from "../MemberData";
import { Member } from "../members/Member";
import { LineupGroupRepository } from "../repository/LineupGroupRepository";
import { RoleSet } from "../roles/RoleSet";
import { Lineup } from "./Lineup";
import { LineupGroup } from "./LineupGroup";
import { SerializedLineup, SerializedMember } from "./SerializedLineup";

export class LineupData {
    public static savedLineups:Array<LineupGroup>

    public static InitializeLineupData() {
        this.savedLineups = LineupGroupRepository.FindAllLineupGroups()
    }


    public static Serialize(lineup:Lineup):SerializedLineup {
        let serialized:SerializedLineup = new SerializedLineup()
        serialized.name = `${lineup.weekend} ${lineup.day}`
        serialized.day = lineup.day
        serialized.weekend = lineup.weekend
        serialized.place = lineup.place

        lineup.roleset.set.forEach((role) => {
            console.log("AAAAAA TO LOCO")
            const member = lineup.GetRoleMember(role)
            const name = member != undefined ? member.nick : "-- Sem escala --"

            serialized.AssignRole(role,{name:name,id:member != undefined ? member.id : -1})
        })
        console.log("TA SERTO MANOOo")
        return serialized
    }

    public static Deserialize(lineup:SerializedLineup):Lineup {
        console.log("Day:" +lineup.day)
        let newLineup = new Lineup(null,lineup.day,lineup.weekend,lineup.place)
        let newRoleSet = new RoleSet(lineup.name,lineup.type)
        newLineup.roleset = newRoleSet

        Object.keys(lineup.line).forEach((role) => {
            let serialized:SerializedMember = lineup.line[role]
            let foundMember:Member = MemberData.FindMemberById(serialized.id)
            newLineup.roleset.AddRole(role,false)

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

    public static AddLineups(lineups:LineupGroup) {
        this.savedLineups = [lineups].concat(this.savedLineups)
    }

    public static UpdateLineups(id:number,updated:LineupGroup) {
        let index = this.savedLineups.findIndex((line) => line.id == id)
        
        if(index == -1) return
        else this.savedLineups[index] = updated
    }

    public static UpdateLineupsByIndex(index:number,updated:LineupGroup) {
        this.savedLineups[index] = updated
    }

    public static FindLineupsByType(type:MemberType) {
        return this.savedLineups.filter((line)=>line.type == type)
    }

}