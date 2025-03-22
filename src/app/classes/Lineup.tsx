import { Member } from "./MemberData";
import { RoleSet } from "./Roles";

/**
 * Tipo de escala
 */
export enum LineupType {
    SINGLE,
    WEEKEND,
    MONTH
}
/**
 * Classe base de uma escala de acólitos
 */
export class Lineup{
    TYPE = LineupType.SINGLE
    line = {}
    members:any=[]
    roleset:RoleSet
    day:string = ""
    weekend:string = ""
    place:string = ""


    Generic(){
        console.log("Hello World!")
    }

    GetRoleMember(role:string):Member{
        return this.line[role]
    }

    GetMemberRole(member:Member):string{
        Object.keys(this.line).forEach((role)=>{
            let curAco = this.line[role]
            if(this.line[role].name == member.name){
                return role
            }
        })
        return null
    }
}

/**
 * Classe para uma escala montada a ser exibida na tela de escalas.
 */
export class StructuredLineup{
    name = "NewLineup"
    lineupType = "Single" // Tipo da escala
    roles = ["Ceroferario 1","Ceroferario 2","Cruciferário","Turiferário","Naveteiro","Librífero"]
    days = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
 
    lineups:Array<Lineup> = []
    monthLineups:object = {}
    allLineups:Array<Lineup> = new Array<Lineup>()
    place:string = ""
}