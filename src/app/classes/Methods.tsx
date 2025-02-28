import { Member, MemberType } from "./MemberData";
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MemberData } from "./MemberData";
import { Lineup } from "./Lineup";

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
 * Encontra o índice do membro dado ou -1 caso o membro não esteja na lista.
 * @param {Member} member membro
 * @param {MemberType} type tipo de membro
 * @returns 
 */
export function GetMemberTypeIndex(member:Member,type:MemberType):number{
    let members:Array<Member>
    
    switch(type){
        case MemberType.ACOLYTE:members = MemberData.allAcolytes; break
        case MemberType.COROINHA:members = MemberData.allCoroinhas; break
    }
    
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
export function GenerateLineupPrompt(lines:Array<Lineup>,roles:Array<string>):string{
    let prompts = []
    for(let i = 0; i < lines.length; i++){
        let curLineup = lines[i]
        let lineupName = curLineup.weekend + " " + curLineup.day
        
        let members = []
        let membersNicks = ""
        members.length = roles.length
        
        for(let j = 0; j < roles.length; j++){
            members[j] = curLineup.line[roles[j]]
            if(members[j] == null){
                membersNicks += "!-VAZIO-!;"
                continue
            }
            membersNicks += members[j].nick+";"
        }

        prompts.push("{"+lineupName+"}"+"["+membersNicks+"]")
    }
    
    let finalPrompt = "Construa uma tabela de escala de serviço com os títulos das colunas (funções) sendo, respectivamente: "

    for (let i = 0; i < roles.length;i++){ //Adiciona as colunas com as funções
        finalPrompt += roles[i]+", "
    }

    finalPrompt += ". Agora, na sequência seguinte, o que está entre chaves é o dia e horário. Insira a data e horário como título nas linhas da tabela. Após a data e hora, existe uma lista de nomes entre colchetes separados por ';', coloque cada nome em uma coluna diferente na ordem que aparecem. Deixe a célula vazia caso o nome seja '!-VAZIO-!'. Ignore o contexto e apenas construa a tabela da forma que foi informada. Lembre-se que cada nome está sendo separado por ; e insira data e hora na tabela. Construa a tabela por completo: "
    for(let i = 0; i < prompts.length;i++){
        finalPrompt += prompts[i]
    }
    
    return finalPrompt
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