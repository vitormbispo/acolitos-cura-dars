import { Member } from "../members/Member";
import { RoleSet } from "../roles/RoleSet";
import { Lineup } from "./Lineup";

/**
 * Tipo de escala
 */
export enum setupType {
    SINGLE,
    WEEKEND,
    MONTH
}
/**
 * Classe base de uma escala de acólitos
 */
export class SerializedLineup{
    private _id:number
    private _name:string
    private _place:string
    private _members:Array<string>
    private _line:object

    constructor(name: string="", place: string="", line: object={}) {
        this._name = name;
        this._place = place;
        this._line = line;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get place(): string {
        return this._place;
    }

    public set place(value: string) {
        this._place = value;
    }

    public get line(): object {
        return this._line;
    }

    public set line(value: object) {
        this._line = value;
    }

    public get members(): Array<string> {
        return this._members;
    }

    public set members(value: Array<string>) {
        this._members = value;
    }

    public AssignRole(role:string,member:string) {
        this.line[role] = member
        
        const assigned:boolean = this.line[role] != null
        this.line[role] = member

        if(assigned) {
            const index = this.members.indexOf(member)
            this.members[index] = member
        }
        else {
            this.members.push(member)
        }
    }

    public UnassignRole(role:string): string {
        const member = this.GetRoleMember(role)
        const index = this.members.indexOf(member)
        this.members.splice(index,1)
        delete this.line[role]
        return member
    }

    /** Retorna o membro relacionado a determinada função dessa escala
    *   @param role Função
    */ 
    public GetRoleMember(role:string):string{
        return this.line[role]
    }

    /** Retorna a função relacionada a determinado membro dessa escala
    *   @param member Membero
    */ 
    public GetMemberRole(member:string):string{
        let roles = Object.keys(this.line)
        for(let i = 0; i < roles.length; i++){
            let curMember:string = this.line[roles[i]]
            if(curMember == member){
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
    public SwitchMembers(srcRole:string,srcLineup:SerializedLineup,targetRole:string,update?:any){
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
    public ReplaceMember(replaceRole:string,newMember:string,update?:any){
        this.AssignRole(replaceRole,newMember)
        let originalIndex = this.members.indexOf(this.GetRoleMember(replaceRole))
        this.members[originalIndex] = newMember
        this.line[replaceRole] = newMember
    }

    public static Serialize(lineup:Lineup):SerializedLineup {
        let serialized:SerializedLineup = new SerializedLineup()
        serialized.name = `${lineup.weekend} ${lineup.day}`
        serialized.place = lineup.place
        lineup.members.forEach((member) => {
            const name = member.getName()
            const role = lineup.GetMemberRole(member)

            serialized.AssignRole(role,name)
        }
    )
        return serialized
    }
}
