import AsyncStorage from "@react-native-async-storage/async-storage"
import { Member, MemberData } from "./MemberData"
import { OrganizeMemberArrayAlpha, RandomNumber } from "./Methods"
import * as FileSystem from 'expo-file-system'
import { Places } from "./Places"
import { Platform, ToastAndroid } from "react-native"
import { Roles, RoleSet } from "./Roles"
import { Lineup, StructuredLineup } from "./Lineup"
import { Preset, PresetsData } from "./PresetsData"

export type AppData = {
    "allAcolytes":{name:string,data:Member[]},
    "allCoroinhas":{name:string,data:Member[]},
    "allLineups":{name:string,data:any[]},
    "allLineupsAcolytes":{name:string,data:any[]},
    "allLineupsCoroinhas":{name:string,data:any[]},
    "allMembers":{name:string,data:Member[]},
    "acolyteRoleSets":{name:string,data:RoleSet[]},
    "coroinhaRoleSets":{name:string,data:RoleSet[]},
    "allPlaces":{name:string,data:string[]},
    "acolyteGenerationPresets":{name:string,data:Array<Preset>},
    "coroinhaGenerationPresets":{name:string,data:Array<Preset>}
}

/**
 * Retorna todos os dados da aplicação em um único objeto
 * @returns AppData
 */
export function RetrieveAppData():AppData{
    let data:AppData = {
        "allAcolytes":{name:"Acólitos",data:MemberData.allAcolytes},
        "allCoroinhas":{name:"Coroinhas",data:MemberData.allCoroinhas},
        "allLineups":{name:"Todas as escalas",data:MemberData.allLineups},
        "allLineupsCoroinhas":{name:"Escalas dos coroinhas",data:MemberData.allLineupsCoroinhas},
        "allLineupsAcolytes":{name:"Escalas dos acólitos",data:MemberData.allLineupsAcolytes},
        "allMembers":{name:"Todos os membros",data:MemberData.allMembers},
        "acolyteRoleSets":{name:"Funções dos acólitos",data:Roles.acolyteRoleSets},
        "coroinhaRoleSets":{name:"Funções dos coroinhas",data:Roles.coroinhaRoleSets},
        "allPlaces":{name:"Locais",data:Places.allPlaces},
        "acolyteGenerationPresets":{name:"Predefinições dos acólitos",data:PresetsData.acolyteGenerationPresets},
        "coroinhaGenerationPresets":{name:"Predefinições dos coroinhas",data:PresetsData.coroinhaGenerationPresets}
    }
    return data
}

/**
 * Retorna uma lista com o nome de todas as propriedades de dados\
 * da aplicação
 * @returns Array<string>
 */
export function RetrieveAppDataProperties():Array<string>{
    return [
        "allAcolytes",
        "allCoroinhas",
        "allLineups",
        "allLineupsAcolytes",
        "allLineupsCoroinhas",
        "allMembers",
        "acolyteRoleSets",
        "coroinhaRoleSets",
        "allPlaces",
        "acolyteGenerationPresets",
        "coroinhaGenerationPresets"
    ]
}

/**
 * Carrega os dados dos acólitos.
 */
export const LoadAcolyteData = async() => {
    console.log("Carregando")
    try {
        console.log("Entrou no try")
        let acolyteData = await AsyncStorage.getItem("AcolyteData")
        let acolyteLineups = await AsyncStorage.getItem("AcolyteLineups")
        let acolytePresets = await AsyncStorage.getItem("AcolytePresets")
        MemberData.allAcolytes = JSON.parse(acolyteData)
        MemberData.allLineupsAcolytes = JSON.parse(acolyteLineups)
        PresetsData.acolyteGenerationPresets = JSON.parse(acolytePresets)

        OrganizeMemberArrayAlpha(MemberData.allAcolytes)
        
        if (MemberData.allAcolytes == null){
            MemberData.allAcolytes = []
        }
        if (MemberData.allLineupsAcolytes == null){
            MemberData.allLineupsAcolytes = []
        }
        console.log("Acolyte Loaded!")
        PresetsData.VerifyPresetsIntegrity()
    } catch (error) {
        console.log(error)
    }

}

/**
 * Carrega os dados dos coroinhas.
 */
export const LoadCoroinhaData = async() => {
    try {
        let coroinhaData = await AsyncStorage.getItem("CoroinhaData")
        let coroinhaLineups = await AsyncStorage.getItem("CoroinhaLineups")
        let coroinhaPresets = await AsyncStorage.getItem("CoroinhaPresets")
        MemberData.allCoroinhas = JSON.parse(coroinhaData)
        MemberData.allLineupsCoroinhas = JSON.parse(coroinhaLineups)
        PresetsData.coroinhaGenerationPresets = JSON.parse(coroinhaPresets)

        OrganizeMemberArrayAlpha(MemberData.allCoroinhas)

        if (MemberData.allCoroinhas == null || MemberData.allCoroinhas == undefined){
            MemberData.allCoroinhas = []
        }
        if (MemberData.allLineupsCoroinhas == null || MemberData.allLineupsCoroinhas == undefined){
            MemberData.allLineupsCoroinhas = []
        }
        if(PresetsData.coroinhaGenerationPresets == null){
            PresetsData.coroinhaGenerationPresets = []
        }

    } catch (error) {
        console.log(error)
    }
}

/**
 * Solicita ao usuário um diretório para então salvar todos os dados da aplicação
 * @param name Nome do arquivo
 * @param mimetype Tipo de arquivo para salvar
 */

export async function SaveDataFile(name:string,mimetype:string,properties:Array<string>){
    let data = RetrieveAppData()
    if(properties != null && properties.length > 0){
        let keys = Object.keys(data)
        keys.forEach((key)=>{
            if(!properties.includes(key)){
                delete data[key]
            }
        })
    } 
    let permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
    
    if(permissions.granted){
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri,name,mimetype)
        .then(async(uri)=>{
            await FileSystem.writeAsStringAsync(uri,JSON.stringify(data),{encoding: FileSystem.EncodingType.UTF8})
                .then(()=>{
                    if(Platform.OS == 'android'){
                        ToastAndroid.show("Dados salvos com sucesso!",2)
                }})             
        })
        .catch((e)=>{
            if(Platform.OS == 'android'){
                ToastAndroid.show("Erro ao salvar os dados! "+e,2)
            }
        })
    }
    else{
        return Promise.reject("Salvamento cancelado.")
    }
}

/**
 * Gera um novo ID de membro que não se repita
 * @returns  ID
 */
export function GenerateMemberID(){
    let allMembers = MemberData.GetAllMembers()
    if(allMembers.length > 10000){
        throw new Error("Quantidade de membros ultrapassou a quantidade representável pelo ID (10000).")
    }
    let id = RandomNumber(0,9999)

    while(GetMemberByID(id,allMembers) != null){
        id = RandomNumber(0,9999)
    }
    return id
}
/**
 * Retorna o membro com determinado ID
 * @param id ID
 * @param members Lista de membros 
 */
export function GetMemberByID(id:number,members:Array<Member>):Member{
    for(let i = 0; i < members.length; i++){
        if(members[i].id == id) {
            return members[i]
        } 
    }
    return null
}
/**
 * Verifica a integridade dos dados dos membros de determinada lista
 * @param members Lista de membros
 */
export function VerifyMembersIntegrity(members:Array<Member>){
    members.forEach((member)=>{

        if(member.id == undefined){
            member.id = GenerateMemberID()
        }
        
        if(member.placeDisp == undefined){
            member.placeDisp = Places.PlacesDispMap()
        }

        if(member.placeRotation == undefined){
            member.placeRotation = Places.PlacesRotationMap()
        }
    })
}

/**
 * Converte todos os dados salvos como objetos comuns em classes estruturadas.
 */
export function ConvertDataToClasses(){
    let acolytes = MemberData.allAcolytes
    for(let i = 0; i < acolytes.length; i++){
        acolytes[i] = ConvertObjectToMember(acolytes[i])
    }
    
    let coroinhas = MemberData.allCoroinhas
    for(let i = 0; i < coroinhas.length; i++){
        coroinhas[i] = ConvertObjectToMember(coroinhas[i])
    }
    
    let allLineups = MemberData.GetAllLineups()
    for(let i = 0; i < allLineups.length; i++){
        let curLine = allLineups[i]
        allLineups[i] = ConvertObjectToStructuredLineup(curLine)
        
        for(let h = 0; h < curLine.lineups.length; h++){
            let line = curLine.lineups[h]
            curLine.lineups[h] = ConvertObjectToLineup(line)
        }
    }

    let acoPresets = PresetsData.acolyteGenerationPresets
    for(let i = 0; i < acoPresets.length;i++){
        let curPreset = acoPresets[i]
        acoPresets[i] = ConvertObjectToPreset(curPreset)
    }
    
    let coroinhaPresets = PresetsData.coroinhaGenerationPresets
    for(let i = 0; i < coroinhaPresets.length;i++){
        let curPreset = coroinhaPresets[i]
        coroinhaPresets[i] = ConvertObjectToPreset(curPreset)
    }
}

/**
 * Converte um objeto para uma escala estruturada (StructuredLineup)
 * @param obj Objeto a converter
 * @returns 
 */
export function ConvertObjectToStructuredLineup(obj:any):StructuredLineup{
    let newLine = new StructuredLineup()
    let props = Object.keys(newLine)
    
    props.forEach((prop)=>{
        newLine[prop] = obj[prop]
    })

    return newLine
}


/**
 * Converte um objeto para um tipo escala (Lineup)
 * @param obj Objeto a converter
 * @returns 
 */
export function ConvertObjectToLineup(obj:any):Lineup{
    let newLine = new Lineup()
    let props = Object.keys(newLine)
    
    props.forEach((prop)=>{
        newLine[prop] = obj[prop]
    })

    return newLine
}

/**
 * Converte um objeto para uma predefinição (Preset)
 * @param obj Objeto a converter
 * @returns 
 */
export function ConvertObjectToPreset(obj:any):Preset{
    let newPreset = new Preset()
    let props = Object.keys(obj)
    
    props.forEach((prop)=>{
        newPreset[prop] = obj[prop]
    })
    return newPreset
}

/**
 * Converte um objeto para uma predefinição (Preset)
 * @param obj Objeto a converter
 * @returns 
 */
export function ConvertObjectToMember(obj:any):Member{
    let newMember = new Member()
    let props = Object.keys(obj)
    
    props.forEach((prop)=>{
        newMember[prop] = obj[prop]
    })
    return newMember
}




