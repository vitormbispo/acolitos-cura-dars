import { Member, MemberType } from "./MemberData";
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MemberData } from "./MemberData";
import { Lineup } from "./Lineup";

/**
 * Retorna a lista de todos os membros do tipo do contexto atual (menuStore)
 * ou de um determinado tipo.
 * @param memberType ?= tipo de membro (caso não seja definido, será usado o tipo do contexto)
 * @returns Lista de membros 
 */
export function GetMemberArray(memberType:MemberType):Array<Member>{
    switch(memberType){
        case MemberType.ACOLYTE:
            return MemberData.allAcolytes
        case MemberType.COROINHA:
            return MemberData.allCoroinhas
        default:
            console.error("Invalid type.")
            return []
    }
}
/**
 * Organiza a *array* de membros em ordem alfabética.
 * @param {Array<Member>} array Lista com os membros
 * @returns 
 */
export function OrganizeMemberArrayAlpha(array:Array<Member>){
    let j = array.length-1
    let aux = array[0]
    
    while(j > 0){
        let index = LastMemberByNameIndex(array.slice(0,j+1))
        aux = array[index]
        array[index] = array[j]
        array[j] = aux

        j--
    }

    return array
}

/** Encontra o índice do último membro da *array* na ordem alfabética
 * 
 * @param {Array<Member>} array Lista de membros
 * @returns 
 */
export function LastMemberByNameIndex(array:Array<Member>){
    let last = 0
    for(let i = 0; i < array.length;i++){
        let curAco = array[i]

        if(curAco.name.toUpperCase() > array[last].name.toUpperCase())
            last = i
    }

    return last
}


/**
 * Encontra o índice do membro dado na lista geral ou -1 caso o membro não esteja na lista.
 * @param {Member} member membro
 * @param {MemberType} type OPCIONAL: tipo de membro (caso seja indefinido, utilizará o tipo do contexto atual)
 * @returns 
 */
export function GetMemberTypeIndex(member:Member,type?:MemberType):number{
    let members:Array<Member> = GetMemberArray(type)
    
    if(member == null){return -1}

    for(let i = 0; i < members.length;i++){
        let curMember = members[i]

        if(curMember == member){
            return i
        }
    }
    return -1
}

/**
 * Encontra o índice do membro em determinada lista.
 * @param {Member} member Mebro
 * @param {Array<Member>} list Lista a procurar
 * @returns 
 */
export function GetMemberIndex(member:Member,list:Array<Member>){
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
 * @param {Member} member Membro a ser removido da lista
 * @param {Array<Member>} list Lista alvo
 */
export function RemoveMemberFromList(member:Member,list:Array<Member>){
    list.splice(GetMemberIndex(member,list),1)
}

/**
 * Gera um prompt Gemini para se gerar uma planilha no Google Sheets.
 * @param {Array<Lineup>} lines Escalas
 * @param {Array<string>} roles Funções
 * @returns 
 */
export function GenerateLineupPrompt(lines:Array<Lineup>):string{
    let placeMappedLines = {} // Escalas mapeadas por local
    let placeMappedRoles = {} // Funções mapeadas por local
    let rolesSet:Set<string> = new Set<string>() // Conjunto de funções geral. (União de todas as funções que aparecem nas escalas)

    for(let i = 0; i < lines.length; i++){
        let curLine = lines[i] // Escala
        // Mapeia local da escala
        let key = curLine.place != undefined ? curLine.place : "Local indefinido"
        if(placeMappedLines[key] == undefined){
            placeMappedLines[key] = [curLine]
            placeMappedRoles[key] = new Set<string>()
            
            curLine.roleset.set.forEach((role)=>{
                placeMappedRoles[key].add(role)
            })
        }
        else{
            placeMappedLines[key].push(curLine)
            curLine.roleset.set.forEach((role)=>{
                placeMappedRoles[key].add(role)
            })
        }
        

        // Adiciona cada função do conjunto da escala atual ao conjunto geral.
        curLine.roleset.set.forEach((role)=>{
            rolesSet.add(role)
        })
    }
    let places = Object.keys(placeMappedLines)
    
    let prompt = "Construa algumas tabelas de escala de serviço. Quero que seja construída uma escala INDIVIDUAL para cada local, sendo os locais: "

    // Adiciona cada local ao prompt
    places.forEach((place)=>{
        prompt += place + ";"
    })

    prompt += ". Cada um desses locais tem funções distintas que definirão as colunas. As colunas(funções) de cada local estão definidas em conjuntos separados por colchetes a seguir. Respectivamente são: "

    // Adiciona as funções ao prompt
    Object.keys(placeMappedRoles).forEach((place)=>{
        let roles:Array<string> = placeMappedRoles[place]
        prompt += place+":["
        roles.forEach((role)=>{
            prompt+= role+","
        })
        prompt += "];"
    }) 

    // Adiciona os membros ao prompt relacionados às suas escalas
    prompt += "A seguir, serão descritas todas as escalas de cada local no formato de vetores de objetos, ou seja: local1=[{linha:*nome da linha*,membros:[*lista de membros*]}], com cada membro seguido de sua respectiva função e por assim em diante:"
    Object.keys(placeMappedRoles).forEach((place)=>{
        let placeLines:Array<Lineup> = placeMappedLines[place]
        prompt += "\n"+place+"=["
        placeLines.forEach((line)=>{
            let members = []
            line.members.forEach((member)=>{
                members.push(member.nick+":"+line.GetMemberRole(member))
            })
            prompt += "{linha:"+line.weekend+line.day+","+"membros:["+members+"]},"
        })
        prompt += "\n];"
    })

    prompt += "Agora, a partir desses dados, construa uma planilha individual para cada local, relacionando os membros a suas funções em seus respectivos dias e locais."
    return prompt
}

/**
 * Copia o texto para a área de transferência do aparelho.
 * @param {string} text Texto
 */
export const CopyToClipboard = async (text:string) => {
    await Clipboard.setStringAsync(text)
    
}

/** Organiza a lista de números em ordem crescente.
 * 
 * @param {Array<string>} array Lista de números
 */
export function SortByNumber(array:Array<number>){
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
 * @param {Array<number>} array Lista de números a ser organizada. Número ou string
 * @param {number} start Índice inicial
 * @param {number} end Índice final
 * @returns {number} O índice do maior número da lista
 */
export function GetGreatestNumIndex(array:Array<number|string>,start:number,end:number):number{
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
export function RandomNumber(min:number, max:number) {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 * Gera uma lista de números aleatórios distintos entre o intervalo
 * @param {*} min Mínimo do intervalo
 * @param {*} max Máximo do intervalo
 * @param {*} quant Tamanho da lista
 * @returns 
 */
export function DistinctRandomNumbers(min:number,max:number,quant:number):any{
    
    if(quant > (max-min)+1){
        console.error("Quantidade de números maior que o intervalo.")
        return []
    }
    
    let numbers = new Set()

    while(numbers.size < quant){
        numbers.add(RandomNumber(min,max))
    }

    return Array.from(numbers);
}

/** Escolhe um elemento aleatório na lista
 * 
 * @param {Array<any>} array Lista
 * @returns 
 */
export function GetRandom(array:Array<any>){
    return array[RandomNumber(0,array.length-1)]
}

/** Verifica se na lista há ou não um determinado membro.
 * 
 * @param member Membro a procurar
 * @param array Lista de membros
 * @returns Membro está na lista
 */
export function HasMember(member:Member,array:Array<Member>):boolean {
    for(let i = 0; i < array.length;i++){
        if(array[i] == member){
            return true
        }
    }

    return false
}

/**
 * Reinicia o último final de semana de todos os membros da lista.
 * @param {Array<Member>} members Lista de membros
 */
export function ResetAllLastWeekend(members:Array<Member>){
    members.forEach((member) => {
        member.lastWeekend = ""
    })
}

/**
 * Embaralha os elementos da array. 
 * @param array Array<any>
 */
export function ShuffleArray(array:Array<any>){
    let auxIndex = 0
    let aux = array[auxIndex]
    
    for(let i = 0; i < array.length; i++){
        let newIndex = RandomNumber(0,array.length-1)
        auxIndex = newIndex
        aux = array[auxIndex]

        array[newIndex] = array[i]
        array[i] = aux
    }
}

/**
 * Retorna o índice de algo na array
 * @param {any} obj Objeto
 * @param {Array<any>} array Array
 * @returns Índice
 */
export function GetIndexFromArray(obj:any,array:Array<any>){
    for(let i = 0; i < array.length; i++){
        if(array[i] == obj){
            return i
        }
    }

    return -1
}

/**
 * Define as prioridades de todos os membros da lista para uma prioridade aleatória entre 0 e 4.
 * @param {Array<Member>} members Lista de membros
 */
export function ShufflePriorities(members:Array<Member>){
    members.forEach((member) => {
        member.priority = RandomNumber(0,4)
    })
}


/**
 * Abrevia um texto para que possua um número máximo de caractéres, substituindo
 * o fim do texto com reticências.
 * Exemplo: >>> AbbreviateText("Matemática",5)
 *              Ma...
 * @param text 
 * @param maxLen 
 * @returns 
 */
export function AbbreviateText(text:string, maxLen:number):string{
    if(text.length < maxLen || maxLen <= 3){return text}

    let abbreviated:string = text.substring(0,maxLen-3)+"..."
    return abbreviated
}

/**
 * Retorna uma cópia absoluta de determinado objeto
 * @param obj Objeto a ser copiado
 */
export function DeepCopyObject(obj:any):any{
    return JSON.parse(JSON.stringify(obj))

}

/**
 * Salva os dados no AsyncStorage
 * @param key Chave
 * @param data Dados
 */
export function SaveData(key:string,data:any) {
    AsyncStorage.setItem(key,JSON.stringify(data))
}

/**
 * Retorna uma lista com todos os membros que não possuem disponibilidade
 * de local ou horário ou que estão marcados como indisponíveis para determinada escala
 * 
 * @param lineup Escala
 * @param type Tipo de membro
 * @returns Lista com os membros indisponíveis
 */
export function GetLineupUnvailableMembers(lineup:Lineup,type:MemberType):Array<Member>{
    let members:Array<Member> = GetMemberArray(type)
    let unvailable:Array<Member> = []

    members.forEach((member)=>{
        if(!member.disp[lineup.weekend][lineup.day] ||
            lineup.place != undefined && !member.placeDisp[lineup.place] ||
            !member.onLineup
        ){
            unvailable.push(member)
        }
    })
    return unvailable
}