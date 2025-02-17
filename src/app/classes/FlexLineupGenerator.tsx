import { Acolyte, AcolyteData } from "./AcolyteData";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { DistinctRandomNumbers, GetRandom, RandomNumber, RemoveMemberFromList as RemoveMember, SaveAcolyteData, SaveCoroinhaData, HasMember, ShuffleArray } from "./Methods";
import { FlexLineup } from "./FlexLineup";


/** Gera uma nova escala flexível de acordo com o tipo (Acólito/Coroinha), fim de semana e dia dadas as funções.
 * Leva em conta a disponibiliade e as prioridades diárias, de funções e gerais.
 * 
 * @param weekend Final de semana
 * @param day Dia
 * @param roles Funções
 * @param type Tipo
 * @returns {FlexLineup|null} Nova escala flexível montada
 */
export function GenerateLineup(weekend:any=null,day:any=null,roles:string[],type:string,randomness:number = 1.3, dayRotation:boolean = true):FlexLineup|null{
    let members:Array<Coroinha|Acolyte> = []

    switch(type){
        case "coroinha" : members = CoroinhaData.allCoroinhas.slice(); break;
        case "acolito" : members = AcolyteData.allAcolytes.slice(); break;
        default: 
            console.error("Invalid type.");
            return null;
    
    }
    
    members = RemoveUnvailable(members,day,weekend) // Remover membros indisponíveis

    // Excluir membros que já estão nesse fim de semana
    if(weekend != "Outro"){
        members = RemoveIfAlreadyOnWeekend(members,weekend,roles.length)
    }
    
    ShuffleArray(members) // Embaralha o array para aumentar a aleatoriedade

    members.forEach((member)=>{
        CalculateScore(member,day)
    })

    let sortedScoreMembers:Array<Acolyte|Coroinha> = []; // Lista ordenada por score.
    
    members.forEach((member)=>{
        InsertSortedByScore(member,sortedScoreMembers) // Insere ordenado
    })
    

    let chosenMembers:Array<Acolyte|Coroinha> = [] // Lista de membros selecionados
    
    let chosenQuant:number = Math.ceil(roles.length*randomness) < sortedScoreMembers.length ? Math.ceil(roles.length*randomness) : sortedScoreMembers.length // Quantidade de membros a selecionar
    let chosenIndexes = DistinctRandomNumbers(0,chosenQuant-1,chosenQuant)

    for(let i = 0; i < chosenIndexes.length;i++){
        chosenMembers.push(sortedScoreMembers[chosenIndexes[i]])
    }

    // Escolher funções para cada membro e montar na classe FlexLineup.
    let newLineup:FlexLineup = new FlexLineup()
    
    roles.forEach((role) => {
        let chosenForRole:Array<Coroinha|Acolyte> = GetRolePrioritizedMembers(chosenMembers,role)

        let member:Coroinha|Acolyte = GetRandom(chosenForRole)

        member.rodizio[role] = roles.length
        
        ReduceAllRoleCooldown(member,1,type)
        newLineup.line.set(role,member)
        newLineup.members.push(member)
        
        RemoveMember(member,chosenMembers)
    })
    
    newLineup.day = day
    newLineup.weekend = weekend

    newLineup.members.forEach((member:Coroinha|Acolyte) => {
        member.priority = 0
        member.weekendPriority[day] = 0
        member.lastWeekend = weekend
    });

    // Ajustar prioridades
    if(day != "Outro"){
        IncreaseAllDayPriority(newLineup.members,day,1,type)
        IncreaseAllGeneralPriority(newLineup.members,1,type)
    }

    // Salvar listas
    if(type == "coroinha"){
        SaveCoroinhaData()
    } 
    else{
        SaveAcolyteData()
    }
    return newLineup
    
}

/** Gera uma nova escala flexível aleatória podendo se basear em dia e fim de semana ou não. 
 * Não afeta e nem leva em conta nenhum tipo de preferência e prioridade, apenas disponibilidade.
 *  
 * @param {string[]} roles Funções
 * @param {string} weekend Fim de semana
 * @param {string} day Dia
 * @returns {FlexLineup} Uma nova escala aleatória
 */
export function GenerateRandomLineup(roles:string[],type:string,weekend:string="Outro",day:string="Outro"):FlexLineup{
    
    let members:Array<Coroinha|Acolyte> = []

    switch(type){
        case "coroinha" : members = CoroinhaData.allCoroinhas.slice(); break;
        case "acolito" : members = AcolyteData.allAcolytes.slice(); break;
        default: 
            console.error("Invalid type.");
            return null;
    
    }

    let availableMembers = []

    availableMembers = RemoveUnvailable(members,"Outro","Outro")

    let generatedLineup = new FlexLineup()
    for(let i = 0; i < roles.length;i++){
        let curRole:string = roles[i]
        let curMemberIndex:number = RandomNumber(0,availableMembers.length-1)
        let curMember:Acolyte|Coroinha = availableMembers[curMemberIndex]
        
        generatedLineup.line.set(curRole,curMember)
        generatedLineup.members.push(curMember)
        availableMembers.splice(curMemberIndex,1)
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend
    return generatedLineup
}

export function CalculateScore(member:Acolyte|Coroinha,day:string){
    let finalScore:number = 0
    
    finalScore += member.priority**2
    finalScore += member.weekendPriority[day]

    member.score = finalScore;
}
/**
 * Insere um novo membro na lista de forma ordenada por score.
 * ESSA FUNÇÃO SÓ DEVE SER UTILIZADA EM LISTAS ORDENADAS POR SCORE.
 * @param member Membro
 * @param array Lista ORDENADA POR SCORE
 *  
 */
export function InsertSortedByScore(member:Acolyte|Coroinha,array:Array<Acolyte|Coroinha>){
    let insertPos:number = -1 // Posição a inserir o novo membro ordenado.
    
    if(array.length == 0){ // Array vazia, apenas push
        array.push(member)
        return
    }

    /**
     * A = 5 B = 3 
     *  C = 4
     */
    for(let i = 0; i < array.length; i ++){
        if(member.score > array[i].score){ // Encontrou primeira posição menor.
            insertPos = i
            break
        }
    }
    if(insertPos == -1){
        array.push(member)
    }
    else{
        array.splice(insertPos,0,member) // Insere ordenado na posição
    }
    
}

/**
 * Remove os membros que não estão disponíveis no dia e fim de semana ou que estão fora da escala.
 * @param {Array<Coroinha|Acolyte>} members Lista de membros 
 * @param {string} day Dia 
 * @param {string} weekend Fim de semana 
 */
function RemoveUnvailable(members:Array<Coroinha|Acolyte>,day:string,weekend:string){
    let availableMembers = []

    for(let i = 0; i < members.length;i++){
        let curMember = members[i]

        if(curMember.onLineup){
            if(day != "Outro" && weekend != "Outro"){
                if(curMember.disp[weekend][day]){
                    availableMembers.push(curMember)
                }
            }
            else{
                availableMembers.push(curMember)
            }
            
        }
    }
    return availableMembers
}

/** Retorna uma lista sem os mebros que já foram escalados nesse fim de semana.
 * Caso a lista seja menor do que a quantidade necessária de mebros, os mebros
 * removidos serão readicionados à lista de disponíveis, até que ela atinja a quantidade mínima.
 * Com o parâmetro de aleatoriedade(randomness) verdadeiro, escolherá mebros aleatórios que foram removidos. 
 * Quando falso, escolherá os membros com maior prioridade que foram removidos
 * 
 * @param {Array<Coroinha|Acolyte>} members Lista de mebros
 * @param {string} weekend Final de semana
 * @param {number} min Mínimo de mebros necessários
 * @param {boolean} randomness Aleatoriedade
 * @returns {Array<Coroinha|Acolyte>} Lista com os mebros disponíveis
 */
function RemoveIfAlreadyOnWeekend(members:Array<Coroinha|Acolyte>,weekend:string,min:number,randomness:boolean = true):Array<Coroinha|Acolyte>{
    let removed:Array<Coroinha|Acolyte> = []
    let available:Array<Coroinha|Acolyte> = []
    
    members.forEach((member:Coroinha|Acolyte) =>{
        if(member.lastWeekend == weekend){
            removed.push(member)
        }
        else{
            available.push(member)
        }
    })

    // Caso ainda não tenha sido atingido o número mínimo de membros, adiciona novos membros até que o mínimo seja
    // atingido ou se esgotem os membros disponíveis.
    let i = 0 // Índice
    let maxChecks = removed.length // Quantidade máxima de checagens (checar até o fim da lista de removidos)
    
    while(available.length < min && i < maxChecks){ 
        let member = null
        if(randomness){
            member = GetRandom(removed)
        }
        else{
            member = GetRandom(GetPrioritizedMembers(removed))
        }
        available.push(member)
        RemoveMember(member,removed)
        i++
    }

    return available
}

function GetRolePrioritizedMembers(members:Array<Coroinha|Acolyte>,role:string):Array<Coroinha|Acolyte>{
    let prioritized:Array<Coroinha|Acolyte> = []
    let smallest:number = members[0].rodizio[role]

    members.forEach((member) => { // Encontra o menor número (prioridade)
        let prio = member.rodizio[role]
        if(prio < smallest){
            smallest = prio
        }
    })

    members.forEach((member)=>{
        if(member.rodizio[role] == smallest){ // Adiciona todos os membros com maior prioridade ao array
            prioritized.push(member)
        }
    })

    return prioritized
}

/** Reduz as prioridades de função de um membro por um determinado peso.
 * 
 * @param {Coroinha|Acolyte} member Membro
 * @param {number} weight Peso
 * @param {string} type Tipo de membro
 */
function ReduceAllRoleCooldown(member:Coroinha|Acolyte,weight:number,type:string){
    if(type == "coroinha"){
        member.rodizio["donsD"]-=weight
        member.rodizio["donsE"]-=weight
        member.rodizio["cestD"]-=weight
        member.rodizio["cestE"]-=weight
    }
    else if(type == "acolito"){
        member.rodizio["cero1"]-=weight
        member.rodizio["cero2"]-=weight
        member.rodizio["cruci"]-=weight
        member.rodizio["libri"]-=weight
        member.rodizio["turib"]-=weight
        member.rodizio["navet"]-=weight
    }
    
}
/** Aumenta a prioridade geral de todos os membros, salvo exceções, por determinado peso
 * 
 * @param exceptions Exceções
 * @param weight Peso
 */
function IncreaseAllGeneralPriority(exceptions:Array<Coroinha|Acolyte>,weight:number,type:string){
    let members:Array<Coroinha|Acolyte> = []

    if(type == "coroinha"){
        members = CoroinhaData.allCoroinhas
    }
    else if(type == "acolito"){
        members = AcolyteData.allAcolytes
    }
    else{
        console.error("Invalid type.")
    }
    
    for(let i = 0; i < members.length;i++){
        let curMember = members[i]

        if(!HasMember(curMember,exceptions)){
            curMember.priority += weight
        }
    }
}

/**
 * Aumenta a prioridade diária de todos os membros por determinado peso, salvo excessões.
 * @param exceptions Excessões
 * @param day Dia
 * @param weight Peso
 */
function IncreaseAllDayPriority(exceptions:Array<Coroinha|Acolyte>,day:string,weight:number,type:string){
    let members:Array<Coroinha|Acolyte> = []
    if(type == "coroinha"){
        members = CoroinhaData.allCoroinhas
    }
    else if(type == "acolito"){
        members = AcolyteData.allAcolytes
    }
    else{
        console.error("Invalid type.")
    }
    
    for(let i =0; i < members.length;i++){
        let curMember = members[i]

        if(!HasMember(curMember,exceptions)){
            curMember.weekendPriority[day]+=weight
        }
    }
}



/** Retorna uma lista com os membros com maior prioridade geral.
 * 
 * @param {Array<Coroinha|Acolyte>} members Lista de membros
 * @returns {Array<Coroinha|Acolyte>} Membros priorizados
 */
function GetPrioritizedMembers(members:Array<Coroinha|Acolyte>):Array<Coroinha|Acolyte>{
    let prioritized:Array<Coroinha|Acolyte> = []
    let smallest:number = members[0].priority

    members.forEach((member) => {
        let prio = member.priority
        if(prio < smallest){
            smallest = prio
        }
    })

    members.forEach((member)=>{
        if(member.priority == smallest){
            prioritized.push(member)
        }
    })

    return prioritized
}