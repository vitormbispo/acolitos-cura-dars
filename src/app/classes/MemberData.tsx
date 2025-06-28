import AsyncStorage from "@react-native-async-storage/async-storage"
import { StructuredLineup } from "./Lineup"

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
    id:number // Chave primária de até 4 dígitos
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

    oldRodizio:object={"cero1":0, // Velho rodízio de função (controle)
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
    oldPriority=0 // Velha prioridade geral (controle)
    
    weekendPriority={"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0} // Prioridade de dia
    oldWeekendPriority={"Sábado - 19h":0,"Domingo - 08h":0,"Domingo - 19h":0} // Velha prioridade de dia (controle)
    
    onLineup = true // Disponível

    lastWeekend = "" // Último fim de semana servido
    selectedOnLineups = []
}

/**
 *  Dados armazenados dos Membros
 */
export class MemberData{ 
    static allAcolytes: Member[] = []
    static allCoroinhas: Member[] = []
    static allMembers: Member[] = []
    static allLineups = [];
    static allLineupsAcolytes:Array<StructuredLineup> = []
    static allLineupsCoroinhas:Array<StructuredLineup> = []

    /**
     * Verifica a integridade dos dados dos membros e salva
     * as alterações necessárias
     */
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
        this.SaveMemberData()
    }

    /**
     * Salva todos os dados dos membros
     */
    static SaveMemberData(){
        SaveAcolyteData()
        SaveCoroinhaData()
    }

    /**
     * Retorna uma lista com todos os membros acólitos e coroinhas
     * @returns 
     */
    static GetAllMembers():Array<Member>{
        return MemberData.allAcolytes.concat(MemberData.allCoroinhas)
    }

    /**
     * Retorna uma lista com todas as escalas dos acólitos e coroinhas
     * @returns 
     */
    static GetAllLineups():Array<any>{
        let joined = MemberData.allLineupsAcolytes.concat(MemberData.allLineupsCoroinhas)
        if(joined == null){
            joined = []
        }
        return joined
    }
    
    /**
     * Checa se um nome já está em uso ou não
     * @param name nome
     * @param members membros
     * @returns 
     */
    static IsNameAvailable(name:string,members:Array<Member>):boolean{
        for(let i = 0; i < members.length; i++){
            if(members[i].name == name){
                return false
            }
        }
        return true
    }

    /**
     * Checa se um apelido já está em uso ou não
     * @param nick apelido
     * @param members membros
     * @returns 
     */
    static IsNickAvailable(nick:string,members:Array<Member>):boolean{
        for(let i = 0; i < members.length; i++){
            if(members[i].nick == nick){
                return false
            }
        }
        return true
    }
}

/**
 * Salva os dados dos acólitos localmente.
 */
export function SaveAcolyteData(){
    AsyncStorage.setItem("AcolyteData",JSON.stringify(MemberData.allAcolytes))
    AsyncStorage.setItem("AcolyteLineups",JSON.stringify(MemberData.allLineupsAcolytes))
}

/**
 * Salva os dados dos coroinhas localmente.
 */
export function SaveCoroinhaData(){
    AsyncStorage.setItem("CoroinhaData",JSON.stringify(MemberData.allCoroinhas))
    AsyncStorage.setItem("CoroinhaLineups",JSON.stringify(MemberData.allLineupsCoroinhas))
}

/**
 * Retorna uma lista com os IDs dos membros presentes em uma lista
 * @param members Lista de membros
 * @returns Lista de IDs
 */
export function MemberIDList(members:Array<Member>):Array<number>{
    let ids = []
    members.forEach((member)=>{
        ids.push(member.id)
    })
    return ids
}

/** 
 * Retorna uma lista de Membros a partir de uma lista de IDs.
 * @param ids Lista de IDs
 * @returns Lista de membros
 */
export function MembersFromIDs(ids:Array<number>):Array<Member>{
    let members = []
    let allMembers = MemberData.GetAllMembers()
    ids.forEach((id)=>{
        let member = GetMemberByID(id,allMembers)
        member != null ? members.push(member) : null
    })
    return members
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