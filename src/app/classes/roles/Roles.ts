import { MemberType } from "../MemberData"
import { RoleSetRepository } from "../repository/RoleSetRepository"
import { RolesData } from "./RolesData"
import { RoleSet } from "./RoleSet"

export class Roles {
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
    
    /**
     * Retorna o conjunto de funções padrão de determinado tipo de membro
     * @returns RoleSet
     */
    public static GetDefaultRoleset(type:MemberType):RoleSet{
        let newSet:RoleSet = new RoleSet("default",type)
        newSet.SetRolesToDefault(false)
        newSet.size = newSet.set.length
        return newSet
    }

    /**
     * Adiciona um novo conjunto de funções
     * @param name Nome do conjunto
     * @param roles Funções
     * @param type Tipo de membro
     */
    public static AddRoleSet(name:string,roles:Array<string>,type:MemberType,updateOnDB:boolean=true) {    
        let newSet = new RoleSet(name,type,roles)
        RolesData.rolesets.push(newSet)
        if(updateOnDB) RoleSetRepository.InsertRoleSet(newSet)
    }

    /**
     * Retorna uma lista de RoleSets padrão.
     * @returns lista de RoleSets
     */
    public static GetDefaultSets():Array<RoleSet> {
        return [
            new RoleSet("Normal",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Librífero"],true),
            new RoleSet("Solenidade",MemberType.ACOLYTE,Object.keys(Roles.DEFAULT_ACOLYTE_ROLES),true),
            new RoleSet("Padrão",MemberType.COROINHA,Object.keys(Roles.DEFAULT_COROINHA_ROLES),true),
            new RoleSet("Reduzida",MemberType.COROINHA,["Dons D.","Dons E."],true)
        ]
    }

    /**
     * Retorna uma lista de RoleSets padrão de um determinado tipo de membro.
     * @param type tipo de membro
     * @returns lista de RoleSets
     */
    public static GetDefaultTypeSets(type:MemberType):Array<RoleSet> {
        switch(type) {
            case MemberType.ACOLYTE:
                return [
                    new RoleSet("Normal",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Librífero"],true),
                    new RoleSet("Solenidade",MemberType.ACOLYTE,Object.keys(Roles.DEFAULT_ACOLYTE_ROLES),true),
                ]
            case MemberType.COROINHA:
                return[
                    new RoleSet("Padrão",MemberType.COROINHA,Object.keys(Roles.DEFAULT_COROINHA_ROLES),true),
                    new RoleSet("Reduzida",MemberType.COROINHA,["Dons D.","Dons E."],true)
                ]
        }
    }

    /**
     * Inicializa os conjuntos de função com seus respectivos valores padrão.
     * @param updateOnDB (opcional) Se `true`, salva as alterações no banco de dados
     */
    public static InitializeSets(updateOnDB:boolean=true){
        RolesData.rolesets = this.GetDefaultSets()

        if(updateOnDB)
            RoleSetRepository.DeleteAll()
            RolesData.rolesets.forEach((set) => RoleSetRepository.InsertRoleSet(set))
    }
    
    /**
     * Retorna um conjunto de funções com determinado nome e tipo
     * @param name Nome do conjunto
     * @param type Tipo de membri
     * @returns RoleSet
     */
    public static GetRoleSet(name:string,type:MemberType):RoleSet{
        let list:Array<RoleSet> = RolesData.GetRoleSetsByType(type)

        let found = list.find((set) => set.name == name)
        if(found == null) console.error("Roleset \'"+name+"\' not found for member type \'"+type+"\'")
        return found        
    }
}