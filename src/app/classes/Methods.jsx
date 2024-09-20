import { Acolyte, AcolyteData } from "./AcolyteData";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { CoroinhaLineup } from "./CoroinhaLineup";
import { Lineup } from "./Lineup";
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from "@react-native-async-storage/async-storage";

class PromptLineup{
    lines =[[]]
}

// Globais
export let coroinhaRoles = ["donsD","donsE","cestD","cestE"]
export let acolyteRoles = ["cero1","cero2","cruci","libri","turib","navet"]

export function OrganizeAcolyteArrayAlpha(array){
    let j = array.length-1
    let aux = array[0]
    
    while(j > 0){
        let index = LastAcolyteByNameIndex(array.slice(0,j+1))
        aux = array[index]
        array[index] = array[j]
        array[j] = aux

        j--
    }

    return array
}

export function LastAcolyteByNameIndex(array){
    let last = 0
    for(let i = 0; i < array.length;i++){
        let curAco = array[i]

        if(curAco.name.toUpperCase() > array[last].name.toUpperCase())
            last = i
    }

    return last
}

export function GetAcolyteByName(name){
    for(let i = 0; i < AcolyteData.allAcolytes.length; i++){
        let curAco = AcolyteData.allAcolytes[i]

        if(curAco.name == name){
            return curAco
        }
    }

    return null
}

export function GetAcolyteIndex(acolyte){
    if(acolyte != null){
        for(let i = 0; i < AcolyteData.allAcolytes.length;i++){
            let curAco = AcolyteData.allAcolytes[i]
    
            if(curAco == acolyte){
                return i
            }
        }
    
        return -1
    }
    return -1
}

export function GetMemberIndex(member,list){
    let chosen = -1
    let i = 0

    while(i < list.length && chosen == -1){
        if(list[i].name == member.name){
            chosen = i
        } 
        i++
    }
    return chosen
}

/** Remove um membro da lista.
 * 
 * @param {*} member Membro a ser removido da lista
 * @param {*} list Lista alvo
 */
export function RemoveMemberFromList(member,list){
    list.splice(GetMemberIndex(member,list),1)
}


export function GenerateLineupPrompt(lines,rolesNames,roles){
    let str = ""
    let names = {"1stWE":"1˚", "2ndWE": "2˚", "3rdWE": "3˚", "4thWE":"4˚", "5thWE":"5˚",
                 "sabado":"Sab. - 19h","domingoAM": "Dom. - 08h","domingoPM": "Dom. - 19h"}
    
    let prompts = []
    for(let i = 0; i < lines.length; i++){
        let curLineup = lines[i]
        let lineupName = names[curLineup.weekend] + " " + names[curLineup.day]
        
        let acolytes = []
        acolytes.length = roles.length
        
        console.log("Acolytes before: "+acolytes)
        for(let j = 0; j < roles.length; j++){
            acolytes[j] = curLineup.line.get(roles[j])
        }

        let acolytesNicks = ""

        for(let j = 0; j < acolytes.length; j++){
            acolytesNicks += acolytes[j].nick+";"
        }

        prompts.push("{"+lineupName+"}"+"["+acolytesNicks+"]")
    }
    
    let finalPrompt = "Construa uma tabela de escala de serviço com os títulos das colunas (funções) sendo, respectivamente: "

    for (let i = 0; i < rolesNames.length;i++){ //Adiciona as colunas com as funções
        finalPrompt += rolesNames[i]+", "
    }

    finalPrompt += ". Agora, na sequência seguinte, o que está entre chaves é o dia e horário. Insira a data e horário como título nas linhas da tabela. Após a data e hora, existe uma lista de nomes entre colchetes separados por ';', coloque cada nome em uma coluna diferente na ordem que aparecem. Ignore o contexto e apenas construa a tabela da forma que foi informada. Lembre-se que cada nome está sendo separado por ; e insira data e hora na tabela: "
    for(let i = 0; i < prompts.length;i++){
        finalPrompt += prompts[i]
    }
    
    return finalPrompt
}

export const CopyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text)
    
}


/** Organiza a lista de números em ordem crescente.
 * 
 * @param array Lista de números
 */
export function SortByNumber(array){
    let j = 0
    for(let i = 0; i < array.length; i++){
        let aux = Number(array[array.length-1])
        let greatestIndex = GetGreatestNumIndex(array,j,array.length)
        
        array[array.length-1] = Number(array[greatestIndex])
        array[greatestIndex] = aux
    }
}
/** Encontra o índice do maior valor numérico da lista. Transforma strings em números
 * 
 * @param array Lista de números a ser organizada. Número ou string
 * @param start Índice inicial
 * @param end Índice final
 * @returns O índice do maior número da lista
 */
export function GetGreatestNumIndex(array,start,end){
    let great = start
    for(let i = start; i < end; i++){
        if(Number(array[i]) > Number(array[great])){
            great = i
            continue
        }
    }
    return great
}

/**
 * Gera um número aleaório entre o mínimo e máximo.
 * @param {Number} min Mínimo
 * @param {Number} max Máximo
 * @returns 
 */
export function RandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
/** Escolhe um elemento aleatório na lista
 * 
 * @param {*} array Lista
 * @returns 
 */
export function GetRandom(array){
    return array[RandomNumber(0,array.length-1)]
}

export function ResetAllLastWeekend(members){
    members.forEach((member) => {
        console.log("Reseting last weekend from ",member.nick)
        member.lastWeekend = ""
        console.log("Result: ",member.lastWeekend)
    })
}

/** Converte uma escala flexível para uma escala de coroinha. Retorna null caso a escala possua chaves de funções que não são de coroinhas
 * 
 * @param {*} lineup Escala a ser convertida
 */
export function FlexToCoroinhaLineup(lineup){
    
    let lineKeys = Array.from(lineup.line.keys())
    lineKeys.forEach((key) => {
        if(GetIndexFromArray(key,coroinhaRoles) == -1){ // Chave do mapa a ser convetido não é de função de coroinha
            console.error("Invalid lineup type!")
            return null
        }
    })

    let converted = new CoroinhaLineup()
    
    converted.coroinhas = lineup.members

    lineKeys.forEach((key) => {
        converted.line.set(key,lineup.line.get(key))
    })
    
    converted.day = lineup.day
    converted.weekend = lineup.weekend

    return converted
}

/** Converte uma escala flexível para uma escala de acólito. Retorna null caso a escala possua chaves de funções que não são de acólitos
 * 
 * @param {*} lineup Escala a ser convertida
 */
export function FlexToAcolyteLineup(lineup){
    
    let lineKeys = Array.from(lineup.line.keys())
    lineKeys.forEach((key) => {
        if(GetIndexFromArray(key,acolyteRoles) == -1){ // Chave do mapa a ser convetido não é de função de acólito
            console.error("Invalid lineup type!")
            return null
        }
    })

    let converted = new Lineup()
    
    converted.coroinhas = lineup.members

    lineKeys.forEach((key) => {
        converted.line.set(key,lineup.line.get(key))
    })
    
    converted.day = lineup.day
    converted.weekend = lineup.weekend

    return converted
}

export function GetIndexFromArray(obj,array){
    for(let i = 0; i < array.length; i++){
        if(array[i] == obj){
            return i
        }
    }

    return -1
}

export function SaveAcolyteData(){
    AsyncStorage.setItem("AcolyteData",JSON.stringify(AcolyteData.allAcolytes))
}

export function SaveCoroinhaData(){
    AsyncStorage.setItem("CoroinhaData",JSON.stringify(CoroinhaData.allCoroinhas))
}