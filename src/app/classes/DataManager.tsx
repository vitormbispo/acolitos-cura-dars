import AsyncStorage from "@react-native-async-storage/async-storage"
import { Member, MemberData } from "./MemberData"
import { OrganizeMemberArrayAlpha } from "./Methods"
import * as FileSystem from 'expo-file-system'
import { Places } from "./Places"
import { Platform, ToastAndroid } from "react-native"

export type AppData = {
    "allAcolytes":{name:string,data:Member[]},
    "allCoroinhas":{name:string,data:Member[]},
    "allLineups":{name:string,data:any[]},
    "allLineupsAcolytes":{name:string,data:any[]},
    "allLineupsCoroinhas":{name:string,data:any[]},
    "allMembers":{name:string,data:Member[]},
}

export function RetrieveAppData():AppData{
    let data:AppData = {
        "allAcolytes":{name:"Acólitos",data:MemberData.allAcolytes},
        "allCoroinhas":{name:"Coroinhas",data:MemberData.allCoroinhas},
        "allLineups":{name:"Todas as escalas",data:MemberData.allLineups},
        "allLineupsCoroinhas":{name:"Escalas dos coroinhas",data:MemberData.allLineupsCoroinhas},
        "allLineupsAcolytes":{name:"Escalas dos acólitos",data:MemberData.allLineupsAcolytes},
        "allMembers":{name:"Todos os membros",data:MemberData.allMembers},
    }
    return data
}

export function RetrieveAppDataProperties(){
    return [
        "allAcolytes",
        "allCoroinhas",
        "allLineups",
        "allLineupsAcolytes",
        "allLineupsCoroinhas",
        "allMembers"]
}


/**
 * Carrega os dados dos acólitos.
 */
export const LoadAcolyteData = async() => {
    try {
        let acolyteData = await AsyncStorage.getItem("AcolyteData")
        let acolyteLineups = await AsyncStorage.getItem("AcolyteLineups")
        let acolyteRolesets = await AsyncStorage.getItem("AcolyteRolesets")
        MemberData.allAcolytes = JSON.parse(acolyteData)
        MemberData.allLineupsAcolytes = JSON.parse(acolyteLineups)
       
        
        OrganizeMemberArrayAlpha(MemberData.allAcolytes)

        if (MemberData.allAcolytes == null || MemberData.allAcolytes == undefined){
            MemberData.allAcolytes = []
        }
        if (MemberData.allLineupsAcolytes == null || MemberData.allLineupsAcolytes == undefined){
            MemberData.allLineupsAcolytes = []
        }
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
        MemberData.allCoroinhas = JSON.parse(coroinhaData)
        MemberData.allLineupsCoroinhas = JSON.parse(coroinhaLineups)

        OrganizeMemberArrayAlpha(MemberData.allCoroinhas)

        if (MemberData.allCoroinhas == null || MemberData.allCoroinhas == undefined){
            MemberData.allCoroinhas = []
        }
        if (MemberData.allLineupsCoroinhas == null || MemberData.allLineupsCoroinhas == undefined){
            MemberData.allLineupsCoroinhas = []
        }

        
        

    } catch (error) {
        console.log(error)
    }
}


/**
 * Solicita ao usuário um diretório para então salvar todos os dados da aplicação
 * @param name 
 * @param mimetype 
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
        }
    )
    }
}

export function VerifyMembersIntegrity(members:Array<Member>){
    members.forEach((member)=>{
        if(member.placeDisp == undefined){
            member.placeDisp = Places.PlacesDispMap()
        }

        if(member.placeRotation == undefined){
            member.placeRotation = Places.PlacesRotationMap()
        }
    })
}

export function SaveData(key:string,data:any) {
    AsyncStorage.setItem(key,JSON.stringify(data))
}