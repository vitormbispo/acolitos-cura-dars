import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { Lineup } from './Lineup'
import { Alert, Platform, ToastAndroid } from 'react-native'

/**
 * Tipo de membro
 */
export enum MemberType{
    ACOLYTE,
    COROINHA
}

/**
 * Classe base dos membros
 */
export class Member {
    TYPE:MemberType = MemberType.ACOLYTE // Tipo de membro
    
    name:string="" // Nome
    nick:string="" // Apelido
    
    rodizio:object={"cero1":0, // Rodízio de função
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
    }

    oldRodizio:object={"cero1":0, // Velho rodízio de função
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
    }

    disp:object={ // Disponibilidade
        "1º":{"Sábado - 19h":true,"Domingo - 08h":true,"Domingo - 19h":true},
        "2º":{"Sábado - 19h":true,"Domingo - 08h":true,"Domingo - 19h":true},
        "3º":{"Sábado - 19h":true,"Domingo - 08h":true,"Domingo - 19h":true},
        "4º":{"Sábado - 19h":true,"Domingo - 08h":true,"Domingo - 19h":true},
        "5º":{"Sábado - 19h":true,"Domingo - 08h":true,"Domingo - 19h":true}
    }

    contact:string="" // Contato
    parents:string=""

    score:number = 0
    priority=0 // Prioridade geral
    oldPriority=0 // Velha prioridade geral
    
    weekendPriority={"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0} // Prioridade de dia
    oldWeekendPriority={"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0} // Velha prioridade de dia
    
    onLineup = true // Escalável

    lastWeekend = "" // Último fim de semana servido
}

/**
 *  Dados armazenados dos Membros
 */
export class MemberData{ 
    static allAcolytes: Member[] = []
    static allCoroinhas: Member[] = []
    static allMembers: Member[] = []
    static allLineups = [];
    static allLineupsAcolytes = []
    static allLineupsCoroinhas = []
}

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
        "allMembers":{name:"Todos os membros",data:MemberData.allMembers}
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