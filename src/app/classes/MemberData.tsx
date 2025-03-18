import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { Lineup } from './Lineup'
import { Alert, Platform, ToastAndroid } from 'react-native'
import { Places } from './Places'
import { OrganizeMemberArrayAlpha, SaveAcolyteData, SaveCoroinhaData } from './Methods'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Roles } from './Roles'

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

    placeDisp:object
    placeRotation:object

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

    static VerifyMemberDataIntegrity(){
        if(this.allAcolytes == null){
            this.allAcolytes = []
        }
        if(this.allCoroinhas == null){
            this.allCoroinhas = []
        }
        if(this.allLineupsAcolytes == null){
            this.allLineupsAcolytes = []
        }
        if(this.allLineupsCoroinhas == null){
            this.allLineupsCoroinhas = []
        }
        SaveAcolyteData()
        SaveCoroinhaData()
    }
}
