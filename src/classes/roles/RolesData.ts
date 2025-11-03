import { MemberType } from "../members/MemberType";
import { RoleSetRepository } from "../repository/RoleSetRepository";
import { RoleSet } from "./RoleSet";

export class RolesData {
    public static rolesets:Array<RoleSet> = []

    public static GetRoleSetsByType(type:MemberType):Array<RoleSet> {
        return this.rolesets.filter((set) => set.type == type)
    }

    public static async InitializeRolesData() {
        await this.LoadRolesetsFromDatabase()
        if(this.rolesets == null || this.rolesets.length == 0) {
            this.InitializeSets()
        }
        return Promise.resolve()
    }

    public static async LoadRolesetsFromDatabase() {
        try {
            this.rolesets = RoleSetRepository.FindAll()
            return Promise.resolve()
        } catch(e) {
            console.error("Error loading RoleSets: "+e)
            return Promise.reject(e)
        }
    }

    public static LoadRolesetsFromDatabaseSync():boolean {
        try {
            this.rolesets = RoleSetRepository.FindAll()
            return true
        } catch(e) {
            console.error("Error loading RoleSets: "+e)
            return false
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
        //console.log("FOUND ROLESET = "+found)
        if(found == null) console.error("Roleset \'"+name+"\' not found for member type \'"+type+"\'")
        return found        
    }

    /**
     * Retorna um conjunto de funções com determinado id.
     * @param id ID
     * @returns RoleSet
     */
    public static GetRoleSetByID(id:number):RoleSet{
        let found = this.rolesets.find((set) => set.id == id)
        console.log("FOUND ROLESET = "+JSON.stringify(found))
        if(found == null) console.error("Roleset not found")
        return found        
    }
    
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

    public static UpdateRoleset(roleset:RoleSet) {
        let index = this.rolesets.findIndex((set) => set.id == roleset.id)
        this.rolesets[index] = roleset
        RoleSetRepository.UpdateRoleSet(roleset)
    }

    /**
     * Retorna uma lista de RoleSets padrão.
     * @returns lista de RoleSets
     */
    public static GetDefaultSets():Array<RoleSet> {
        return [
            new RoleSet("Normal",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Librífero"],true),
            new RoleSet("Solenidade",MemberType.ACOLYTE,RoleSet.DEFAULT_ACOLYTE_ROLES,true),
            new RoleSet("Padrão",MemberType.COROINHA,RoleSet.DEFAULT_COROINHA_ROLES,true),
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
                    new RoleSet("Solenidade",MemberType.ACOLYTE,Object.keys(RoleSet.DEFAULT_ACOLYTE_ROLES),true),
                ]
            case MemberType.COROINHA:
                return[
                    new RoleSet("Padrão",MemberType.COROINHA,Object.keys(RoleSet.DEFAULT_COROINHA_ROLES),true),
                    new RoleSet("Reduzida",MemberType.COROINHA,["Dons D.","Dons E."],true)
                ]
        }
    }

    public static GetDefaultRolesByType(type:MemberType):Array<string> {
        switch(type) {
            case MemberType.ACOLYTE: return RoleSet.DEFAULT_ACOLYTE_ROLES
            case MemberType.COROINHA: return RoleSet.DEFAULT_COROINHA_ROLES
        }
    }
}