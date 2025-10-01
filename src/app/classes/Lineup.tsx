import { Member } from "./members/Member";
import { RoleSet } from "./roles/RoleSet";

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
    private line:object
    private members:Array<Member>
    private roleset:RoleSet
    private day:string = ""
    private weekend:string = ""
    private place:string = ""

    constructor(roleset:RoleSet,day:string="",weekend:string="",place:string="") {
        this.line = {}
        this.members = []
        this.day = day
        this.weekend = weekend
        this.place = place
        this.roleset = roleset
    }

    public AssignRole(role:string,member:Member) {
        if(!this.roleset.set.includes(role)) {
            console.error(`Error assigning role "${role}". This role doesn't exist in this lineup's RoleSet!`)
            return
        }
        this.line[role] = member
        this.members.push(member)
    }

    public UnassignRole(role:string): Member {
        const member = this.GetRoleMember(role)
        delete this.line[role]
        return member
    }

    /** Retorna o membro relacionado a determinada função dessa escala
    *   @param role Função
    */ 
    GetRoleMember(role:string):Member{
        return this.line[role]
    }

    /** Retorna a função relacionada a determinado membro dessa escala
    *   @param member Membero
    */ 
    GetMemberRole(member:Member):string{
        let roles = Object.keys(this.line)
        for(let i = 0; i < roles.length; i++){
            let curAco:Member = this.line[roles[i]]
            if(curAco.equals(member)){
                return roles[i]
            }
        }
        return null
    }

    /**
     * Troca dois membros de função/posição a partir
     * das funções e escalas das quais estão relacionados
     * e, se especificado, executa uma função para 
     * atualizar o componente relacionado à essa escala
     * 
     * @param srcRole Função do membro fonte
     * @param srcLineup Escala do membro fonte
     * @param targetRole Função do membro alvo
     * @param update Função para atualizar os componentes após a troca
     */
    SwitchMembers(srcRole:string,srcLineup:Lineup,targetRole:string,update?:any){
        
        let aux = this.GetRoleMember(targetRole)

        this.line[targetRole] = srcLineup.GetRoleMember(srcRole)
        this.members[this.members.indexOf(aux)] = srcLineup.GetRoleMember(srcRole)
        
        srcLineup.line[srcRole] = aux
        this.members[this.members.indexOf(this.GetRoleMember(targetRole))] = aux
        update()
    }

    /**
     * Substitui um membro escalado em determinada função dessa escala
     * e, se especificado, executa uma função para 
     * atualizar o componente relacionado à essa escala
     * 
     * @param replaceRole Função a ser substituído
     * @param newMember Membro substituto
     * @param update Função para atualizar o componente após substituição
     */
    ReplaceMember(replaceRole:string,newMember:Member,update?:any){
        let originalIndex = this.members.indexOf(this.GetRoleMember(replaceRole))
        this.members[originalIndex] = newMember
        this.line[replaceRole] = newMember
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