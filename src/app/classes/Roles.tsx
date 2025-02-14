import { Member, MemberType } from "./MemberData"

export class RoleSet{
    name:string = ""
    type:MemberType = MemberType.ACOLYTE
    set:Array<string> = []
    size:number = 0
    constructor(name:string,type:MemberType,set?:Array<string>){
        this.name = name
        this.type = type
        this.set = set
        this.size = set.length
    }

    /**
    * Adiciona uma nova função ao conjunto
     * @param role Função a adicionar
     */
    addRole(role:string){
        this.set.push(role)
    }
    
    /**
     * Define o conjunto de funções para o padrão do tipo de membros.
     */
    setRolesToDefault(){
        switch(this.type){
            case MemberType.ACOLYTE:
                this.set = Object.keys(Roles.defaultAcolyteRoles); break
            case MemberType.COROINHA:
                this.set = Object.keys(Roles.defaultCoroinhaRoles); break
        }
    }

    /**
     * Define o conjunto de funções
     * @param roles Array de strings com as funções
     */
    setRoles(roles:string[]){
        this.set = roles
    }
}

export class Roles {
    static defaultAcolyteRoles:object = {
        "Ceroferário 1":0,
        "Ceroferário 2":0,
        "Cruciferário":0,
        "Turiferário":0,
        "Naveteiro":0,
        "Librífero":0,
    }

    static defaultCoroinhaRoles:object = {
        "Dons D.":0,
        "Dons E.":0,
        "Cestinho D.":0,
        "Cestinho E.":0
    }

    static acolyteRoleSets:Array<RoleSet>
    static coroinhaRoleSets:Array<RoleSet>

    static addRoleSet(name:string,roles:Array<string>,type:MemberType) {
        let newSet = new RoleSet(name,type,roles)
        switch(type){
            case MemberType.ACOLYTE:
                Roles.acolyteRoleSets.push(newSet); break
            case MemberType.COROINHA:
                Roles.coroinhaRoleSets.push(newSet); break
        }
    }

    static initializeSets(type:MemberType){
        switch(type){
            case MemberType.ACOLYTE:
                Roles.acolyteRoleSets = [
                    new RoleSet("default",MemberType.ACOLYTE,Object.keys(Roles.defaultAcolyteRoles)),
                    new RoleSet("minimal",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Librífero"])
                ]; break
            case MemberType.COROINHA:
                Roles.coroinhaRoleSets = [
                    new RoleSet("default",MemberType.COROINHA,Object.keys(Roles.defaultCoroinhaRoles)),
                    new RoleSet("minimal",MemberType.COROINHA,["Dons D.","Dons E."])
                ]; break     
        }
    }

    static getRoleSet(name:string,type:MemberType){
        let list:Array<RoleSet>
        switch(type){
            case MemberType.ACOLYTE:
                list = Roles.acolyteRoleSets; break
            case MemberType.COROINHA:
                list = Roles.coroinhaRoleSets; break
        }

        for(let i = 0; i < list.length; i++){
            if(list[i].name == name){
                return list[i]
            }
        }

        console.error("Roleset \'"+name+"\' not found for member type \'"+type+"\'")
    }
}

