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

    public static RemoveGroup(group:LineupGroup) {
        let index = this.savedLineups.indexOf(group)
        if(index == -1) {
            console.error("This group doesn't exist!")
            return
        }

        this.savedLineups.splice(index,1)
        LineupGroupRepository.Delete(group.id)
    }

    public static RemoveGroupByIndex(index:number) {
        if(index == -1) {
            console.error("This group doesn't exist!")
            return
        }
        
        let group = this.savedLineups[index]
        LineupGroupRepository.Delete(group.id)
        this.savedLineups.splice(index,1)
    }
}