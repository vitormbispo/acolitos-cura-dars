import { Member } from "../members/Member";
import { RoleSet } from "../roles/RoleSet";

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
    private _id:number
    private line:object
    private _members:Array<Member>
    private _roleset:RoleSet
    private _day:string = ""
    private _weekend:string = ""
    private _place:string = ""

    constructor(roleset:RoleSet,day:string="",weekend:string="",place:string="") {
        this.line = {}
        this._members = []
        this.day = day
        this.weekend = weekend
        this.place = place
        this.roleset = roleset
    }

    public get id(): number {
        return this._id
    }

    public set id(value: number) {
        this._id = value
    }

    public get members(): Array<Member> {
        return this._members;
    }

    public get roleset(): RoleSet {
        return this._roleset;
    }
    public set roleset(value: RoleSet) {
        this._roleset = value;
    }

    public get day(): string {
        return this._day;
    }
    public set day(value: string) {
        this._day = value;
    }

    public get weekend(): string {
        return this._weekend;
    }
    public set weekend(value: string) {
        this._weekend = value;
    }

    public get place(): string {
        return this._place;
    }
    public set place(value: string) {
        this._place = value;
    }

    public AssignRole(role:string,member:Member) {
        if(!this.roleset.set.includes(role)) {
            console.error(`Error assigning role "${role}". This role doesn't exist in this lineup's RoleSet!`)
            return
        }
        
        const assigned:boolean = this.line[role] != null
        this.line[role] = member

        if(assigned) {
            const index = this.members.indexOf(this.GetRoleMember(role))
            this.members[index] = member
        }
        else {
            this.members.push(member)
        }
    }

    public UnassignRole(role:string): Member {
        const member = this.GetRoleMember(role)
        const index = this.members.indexOf(member)
        this.members.splice(index,1)
        delete this.line[role]
        return member
    }

    /** Retorna o membro relacionado a determinada função dessa escala
    *   @param role Função
    */ 
    public GetRoleMember(role:string):Member{
        return this.line[role]
    }

    /** Retorna a função relacionada a determinado membro dessa escala
    *   @param member Membero
    */ 
    public GetMemberRole(member:Member):string{
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
    public SwitchMembers(srcRole:string,srcLineup:Lineup,targetRole:string,update?:any){
        let targetMember = this.UnassignRole(targetRole)
        let sourceMember = srcLineup.UnassignRole(srcRole)

        this.AssignRole(targetRole,sourceMember)
        srcLineup.AssignRole(srcRole,targetMember)

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
    public ReplaceMember(replaceRole:string,newMember:Member,update?:any){
        this.AssignRole(replaceRole,newMember)
        let originalIndex = this.members.indexOf(this.GetRoleMember(replaceRole))
        this.members[originalIndex] = newMember
        this.line[replaceRole] = newMember
    }

}