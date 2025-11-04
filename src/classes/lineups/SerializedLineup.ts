import { MemberType } from "../members/MemberType"

/**
 * Tipo de membro serializado
 */
export type SerializedMember = {
    id:number
    name:string
    type?:MemberType
}

/**
 * Classe serializada de uma escala de acólitos
 */
export class SerializedLineup{
    private _id:number
    private _name:string
    private _day:string
    private _weekend:string
    private _type:MemberType
    private _place:string
    private _line:object

    constructor(name: string="", place: string="", line: object={}) {
        this._name = name;
        this._place = place;
        this._line = line;
    }

    public get id(): number { return this._id; }
    public set id(value: number) { this._id = value; }

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get day(): string { return this._day; }
    public set day(value: string) { this._day = value; }

    public get weekend(): string { return this._weekend; }
    public set weekend(value: string) { this._weekend = value; }

    public get place(): string { return this._place; }
    public set place(value: string) { this._place = value; }

    public get type(): MemberType { return this._type; }
    public set type(value: MemberType) { this._type = value; }

    public get line(): object { return this._line; }
    public set line(value: object) { this._line = value; }

    /**
     * Atribui um membro a uma determinada função da escala
     * @param role Função
     * @param member Escala
     */
    public AssignRole(role:string,member:SerializedMember) {
        this.line[role] = member
    }

     /**
     * Remove um membro de uma determinada função da escala
     * @param role Função
     * @param member Escala
     * @returns o objeto do membro removido
     */
    public UnassignRole(role:string): SerializedMember {
        const member = this.GetRoleMember(role)
        delete this.line[role]
        return member
    }

    /** Retorna o membro relacionado a determinada função dessa escala
    *   @param role Função
    */ 
    public GetRoleMember(role:string):SerializedMember{
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
    public ReplaceMember(replaceRole:string,newMember:SerializedMember,update?:any){
        this.AssignRole(replaceRole,newMember)
        update()
    }

    public asJSON():string {
        return JSON.stringify(this)
    }

    public static fromJSON(json:string):SerializedLineup {
        let obj = JSON.parse(json)
        let newLineup = new SerializedLineup(obj.name,obj.place,obj.line)
        newLineup.day = obj.day
        newLineup.weekend = obj.weekend
        newLineup.id = obj.id
        return newLineup

    }
}
