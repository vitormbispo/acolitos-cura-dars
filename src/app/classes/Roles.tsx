import AsyncStorage from "@react-native-async-storage/async-storage"
import { MemberType } from "./MemberData"

/**
 * Conjunto de funções
 */
export class RoleSet{
    name:string = "" // Nome
    type:MemberType = MemberType.ACOLYTE // Tipo de membro
    set:Array<string> = [] // Lista de funções
    size:number = 0 // Tamanho do conjunto
    isDefault:boolean = false // É padrão? (OBS: NÃO permitir criação de conjuntos padrão pelo usuário)

    constructor(name:string,type:MemberType,set?:Array<string>,isDefault?:boolean){
        this.name = name
        this.type = type
        this.set = set
        this.size = set != undefined ? set.length : 0
        this.isDefault = isDefault != undefined ? isDefault : false
        
    }
    
    /**
    * Adiciona uma nova função ao conjunto
     * @param role Função a adicionar
     */
    AddRole(role:string){
        this.set.push(role)
    }
    /**
     * Exclui determinada função do conjunto
     * @param role Nome da função a remover
     * @returns 
     */
    RemoveRole(role:string){
        let index = this.set.indexOf(role)
        if(index == -1){console.error("Role not found");return}

        this.set.splice(index,1)
    }
    /**
     * Define o conjunto de funções para o padrão do tipo de membros.
     */
    SetRolesToDefault(){
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

/**
 * Armazena dados e métodos relacionados à funções
 */
export class Roles {
    /**
     * Funções padrão dos acólitos
     */
    static defaultAcolyteRoles:object = {
        "Ceroferário 1":0,
        "Ceroferário 2":0,
        "Cruciferário":0,
        "Turiferário":0,
        "Naveteiro":0,
        "Librífero":0,
    }
    /**
     * Funções padrão doscoroinhas
     */
    static defaultCoroinhaRoles:object = {
        "Dons D.":0,
        "Dons E.":0,
        "Cestinho D.":0,
        "Cestinho E.":0
    }

    static acolyteRoleSets:Array<RoleSet> = [] // Conjuntos de funções dos acólitos
    static coroinhaRoleSets:Array<RoleSet> = [] // Conjuntos de funções dos coroinhas

    /**
     * Retorna o conjunto de funções padrão de determinado tipo de membro
     * @returns RoleSet
     */
    static GetDefaultRoleset(type:MemberType):RoleSet{
        let newSet:RoleSet = new RoleSet("default",type)
        newSet.SetRolesToDefault()
        newSet.size = newSet.set.length
        return newSet
    }

    /**
     * Adiciona um novo conjunto de funções
     * @param name Nome do conjunto
     * @param roles Funções
     * @param type Tipo de membro
     */
    static AddRoleSet(name:string,roles:Array<string>,type:MemberType) {    
        let newSet = new RoleSet(name,type,roles)
        switch(type){
            case MemberType.ACOLYTE:
                Roles.acolyteRoleSets.push(newSet)
                SaveData("AcolyteRolesets",Roles.acolyteRoleSets)
                break
            case MemberType.COROINHA:
                Roles.coroinhaRoleSets.push(newSet)
                SaveData("CoroinhaRolesets",Roles.coroinhaRoleSets)
                break
        }
    }

    /**
     * Retorna os conjuntos de função padrão dos acólitos
     * @returns Array<RoleSet>
     */
    static GetDefaultAcolyteSet():Array<RoleSet>{
        return [
            new RoleSet("Solenidade",MemberType.ACOLYTE,Object.keys(Roles.defaultAcolyteRoles),true),
            new RoleSet("Normal",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Librífero"],true)
        ]
    }

    /**
     * Retorna os conjuntos de função padrão dos coroinhas
     * @returns Array<RoleSet>
     */
    static GetDefaultCoroinhaSet():Array<RoleSet>{
        return[
            new RoleSet("Padrão",MemberType.COROINHA,Object.keys(Roles.defaultCoroinhaRoles),true),
            new RoleSet("Reduzida",MemberType.COROINHA,["Dons D.","Dons E."],true)
        ]
    }

    /**
     * Inicializa os conjuntos de função com seus respectivos valores padrão
     * @param type 
     */
    static InitializeSets(type:MemberType){
        switch(type){
            case MemberType.ACOLYTE:
                Roles.acolyteRoleSets = this.GetDefaultAcolyteSet(); break
            case MemberType.COROINHA:
                Roles.coroinhaRoleSets = this.GetDefaultCoroinhaSet(); break     
        }
    }
    
    /**
     * Retorna um conjunto de funções com determinado nome e tipo
     * @param name Nome do conjunto
     * @param type Tipo de membri
     * @returns RoleSet
     */
    static GetRoleSet(name:string,type:MemberType):RoleSet{
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

    /**
     * Verifica a integridade dos dados dos conjuntos de função
     */
    static VerifyRolesIntegrity(){
        if(this.acolyteRoleSets == null){
            this.acolyteRoleSets = this.GetDefaultAcolyteSet()
        }

        if(this.coroinhaRoleSets == null){
            this.coroinhaRoleSets = this.GetDefaultCoroinhaSet()
        }

        SaveData("AcolyteRolesets",this.acolyteRoleSets)
        SaveData("CoroinhaRolesets",this.coroinhaRoleSets)
    }

    /**
     *  Salva os dados dos conjuntos de função no AsyncStorage
     */
    static SaveRolesets(){
        SaveData("AcolyteRolesets",this.acolyteRoleSets)
        SaveData("CoroinhaRolesets",this.coroinhaRoleSets)
    }
}

/**
 * Carrega os conjuntos de função dos acólitos
 */
export async function LoadAcolyteRolesets() {
    let sets = await AsyncStorage.getItem("AcolyteRolesets")
    Roles.acolyteRoleSets = JSON.parse(sets)

    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
                    
}

/**
 * Carrega os conjuntos de função dos coroinhas
 */
export async function LoadCoroinhaRolesets() {
    let sets = await AsyncStorage.getItem("CoroinhaRolesets")
    Roles.coroinhaRoleSets = JSON.parse(sets)
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    }
}

/**
 * Salva os dados no AsyncStorage
 * @param key Chave
 * @param data Dados
 */
function SaveData(key:string,data:any) {
    AsyncStorage.setItem(key,JSON.stringify(data))
}
