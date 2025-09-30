import { MemberType } from "../MemberData"
import { RoleSetRepository } from "../repository/RoleSetRepository"
import { RolesRepository } from "../repository/RolesRepository"
import { SetRolesRepository } from "../repository/SetRolesRepository"
import { Roles } from "./Roles"
import { RolesData } from "./RolesData"

export class RoleSet{
    private _id:number
    private _name:string = "" // Nome
    private _type:MemberType = MemberType.ACOLYTE // Tipo de membro
    private _set:Array<string> = [] // Lista de funções
    private _size:number = 0 // Tamanho do conjunto
    private readonly _isDefault:boolean = false // É padrão? (OBS: NÃO permitir criação de conjuntos padrão pelo usuário)

    constructor(name:string,type:MemberType,set?:Array<string>,isDefault?:boolean){
        this._name = name
        this.type = type
        this.set = set
        this.size = set != undefined ? set.length : 0
        this._isDefault = isDefault != undefined ? isDefault : false
        
    }
    
    public static readonly DEFAULT_ACOLYTE_ROLES:Array<string> = [
        "Ceroferário 1",
        "Ceroferário 2",
        "Cruciferário",
        "Turiferário",
        "Naveteiro",
        "Librífero"]
    
    public static readonly DEFAULT_COROINHA_ROLES:Array<string> = [
        "Dons D.",
        "Dons E.",
        "Cestinho D.",
        "Cestinho E."
    ]

    public get id() {
        return this._id
    }

    public set id(id:number) {
        this._id = id
    }
    public get name() {
        return this._name
    }

    public set name(name:string) {
        this._name = name
    }
    public get type() {
        return this._type
    }

    public set type(type: MemberType) {
        this._type = type
    }

    public get set() {
        return this._set
    }

    public set set(set: Array<string>) {
        this._set = set
        //this._size = set.length
    }

    public get size() {
        return this._size
    }

    public set size(size: number) {
        this._size = size
    }

    public get isDefault() {
        return this._isDefault
    }

    /**
    * Adiciona uma nova função ao conjunto
     * @param role Função a adicionar
     */
    public AddRole(role:string, updateOnDB:boolean=true){
        this.set.push(role)

        if(updateOnDB) {
            let roleId = RolesRepository.FindOrInsertRole(role)
            SetRolesRepository.InsertSetRole(roleId,this.id)
        }
    }
    /**
     * Exclui determinada função do conjunto
     * @param role Nome da função a remover
     * @returns `true` se a remoção for bem-sucedida
     */
    public RemoveRole(role:string, updateOnDB:boolean=true):boolean {
        let index = this.set.indexOf(role)
        if(index == -1){console.error("Role not found");return false}

        this.set.splice(index,1)

        if(updateOnDB) {
            let roleId = RolesRepository.FindOrInsertRole(role)
            SetRolesRepository.DeleteByRoleAndSetID(roleId, this.id)  
        }

        return true
    }

    /**
     * Define o conjunto de funções para o padrão do tipo de membros.
     */
    public SetRolesToDefault(updateOnDB:boolean=true){
        switch(this.type){
            case MemberType.ACOLYTE:
                this.set = Object.keys(RoleSet.DEFAULT_ACOLYTE_ROLES); break
            case MemberType.COROINHA:
                this.set = Object.keys(RoleSet.DEFAULT_COROINHA_ROLES); break
        }

        if(updateOnDB) {
            SetRolesRepository.DeleteBySetID(this.id)
        
            this.set.forEach(role => {
                let roleID = RolesRepository.FindOrInsertRole(role)
                SetRolesRepository.InsertSetRole(roleID,this.id)
            })
        }
    }

    /**
     * Atualiza todas as funções do conjunto no banco de dados
     */
    public UpdateSetOnDB() {
        RoleSetRepository.UpdateRoleSet(this)
    }

    /**
     * Define o conjunto de funções
     * @param roles Array de strings com as funções
     */
    public setRoles(roles:string[]){
        this.set = roles
    }
}