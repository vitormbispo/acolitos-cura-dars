import { DistinctRandomNumbers, GetRandom, RandomNumber, RemoveMemberFromList as RemoveMember, SaveAcolyteData, SaveCoroinhaData, HasMember, ShuffleArray } from "./Methods";
import { Member, MemberData, MemberType } from "./MemberData";
import { Roles, RoleSet } from "./Roles";
import { Lineup } from "./Lineup";


/** Gera uma nova escala flexível de acordo com o tipo (Acólito/Coroinha), fim de semana e dia dadas as funções.
 * Leva em conta a disponibiliade e as prioridades diárias, de funções e gerais.
 * 
 * @param weekend Final de semana
 * @param day Dia
 * @param roles Funções
 * @param type Tipo
 * @returns {Lineup|null} Nova escala flexível montada
 */
export function GenerateLineup(weekend:any=null,day:any=null,roleset:RoleSet,type:MemberType,randomness:number = 1.3, dayRotation:boolean = true):Lineup|null{
    let members:Array<Member> = []

    switch(type){
        case MemberType.COROINHA : members = MemberData.allCoroinhas; break
        case MemberType.ACOLYTE : members = MemberData.allAcolytes; break
        default: 
            console.error("Invalid type.")
            return null
    }
    
    if(members == null){
        console.error("Empty list")
        return null
    }

    members = members.slice()

    members = RemoveUnvailable(members,day,weekend) // Remover membros indisponíveis

    // Excluir membros que já estão nesse fim de semana
    if(weekend != "Outro"){
        members = RemoveIfAlreadyOnWeekend(members,weekend,roleset.size)
    }
    
    ShuffleArray(members) // Embaralha o array para aumentar a aleatoriedade

    members.forEach((member)=>{
        CalculateScore(member,day)
    })

    let sortedScoreMembers:Array<Member> = []; // Lista ordenada por score.
    
    members.forEach((member)=>{
        InsertSortedByScore(member,sortedScoreMembers) // Insere ordenado
    })
    

    let chosenMembers:Array<Member> = [] // Lista de membros selecionados
    
    let chosenQuant:number = Math.ceil(roleset.size*randomness) < sortedScoreMembers.length ? Math.ceil(roleset.size*randomness) : sortedScoreMembers.length // Quantidade de membros a selecionar
    let chosenIndexes = DistinctRandomNumbers(0,chosenQuant-1,chosenQuant)

    for(let i = 0; i < chosenIndexes.length;i++){
        chosenMembers.push(sortedScoreMembers[chosenIndexes[i]])
    }

    // Escolher funções para cada membro e montar na classe Lineup.
    let newLineup:Lineup = new Lineup()

    for(let i = 0; i < roleset.size; i++){
        let role = roleset.set[i]
        
        let chosenForRole:Array<Member> = GetRolePrioritizedMembers(chosenMembers,role)
        let member:Member = GetRandom(chosenForRole)

        member.rodizio[role] = roleset.size
        
        IncreaseAllRoleCooldown(member,1,type)
        newLineup.line.set(role,member)
        newLineup.members.push(member)
        
        RemoveMember(member,chosenMembers)
        if(chosenMembers.length == 0 && i+1 < roleset.size){
            console.error("Not enough members! Only partial lineup will be generated.")
            break;
        }
    }
    
    newLineup.day = day
    newLineup.weekend = weekend

    newLineup.members.forEach((member:Member) => {
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
    switch(type){
        case MemberType.ACOLYTE:
            SaveAcolyteData(); break
        case MemberType.COROINHA:
            SaveCoroinhaData(); break
    }
    return newLineup
    
}

/** Gera uma nova escala flexível aleatória podendo se basear em dia e fim de semana ou não. 
 * Não afeta e nem leva em conta nenhum tipo de preferência e prioridade, apenas disponibilidade.
 *  
 * @param {string[]} roles Funções
 * @param {string} weekend Fim de semana
 * @param {string} day Dia
 * @returns {Lineup} Uma nova escala aleatória
 */
export function GenerateRandomLineup(roleset:RoleSet,type:MemberType,weekend:string="Outro",day:string="Outro"):Lineup{
    
    let members:Array<Member> = []

    switch(type){
        case MemberType.COROINHA : members = MemberData.allCoroinhas.slice(); break;
        case MemberType.ACOLYTE : members = MemberData.allAcolytes.slice(); break;
        default: 
            console.error("Invalid type.");
            return null;
    
    }

    let availableMembers = []

    availableMembers = RemoveUnvailable(members,"Outro","Outro")

    let generatedLineup = new Lineup()
    for(let i = 0; i < roleset.size;i++){
        let curRole:string = roleset.set[i]
        let curMemberIndex:number = RandomNumber(0,availableMembers.length-1)
        let curMember:Member = availableMembers[curMemberIndex]
        
        generatedLineup.line.set(curRole,curMember)
        generatedLineup.members.push(curMember)
        availableMembers.splice(curMemberIndex,1)
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend
    return generatedLineup
}

export function CalculateScore(member:Member,day:string){
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
export function InsertSortedByScore(member:Member,array:Array<Member>){
    let insertPos:number = -1 // Posição a inserir o novo membro ordenado.
    
    if(array.length == 0){ // Array vazia, apenas push
        array.push(member)
        return
    }

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
function RemoveUnvailable(members:Array<Member>,day:string,weekend:string){
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
 * @param {Array<Member>} members Lista de mebros
 * @param {string} weekend Final de semana
 * @param {number} min Mínimo de mebros necessários
 * @param {boolean} randomness Aleatoriedade
 * @returns {Array<Member>} Lista com os mebros disponíveis
 */
function RemoveIfAlreadyOnWeekend(members:Array<Member>,weekend:string,min:number,randomness:boolean = true):Array<Member>{
    let removed:Array<Member> = []
    let available:Array<Member> = []
    
    members.forEach((member:Member) =>{
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

/**
 * Encontra os acólitos com maior priordade de determinada função
 * @param members Lista de membros
 * @param role Função
 * @returns Membros priorizados
 */
function GetRolePrioritizedMembers(members:Array<Member>,role:string):Array<Member>{
    let prioritized:Array<Member> = []
    let greatest:number = members[0].rodizio[role]

    members.forEach((member) => { // Encontra o menor número (prioridade)
        let prio = member.rodizio[role]
        if(prio > greatest){
            greatest = prio
        }
    })

    members.forEach((member)=>{
        if(member.rodizio[role] == greatest){ // Adiciona todos os membros com maior prioridade ao array
            prioritized.push(member)
        }
    })

    return prioritized
}

/** Aumenta as prioridades das funções de um membro que estão no conjunto de funções por um determinado peso.
 *  Caso o conjunto não seja determinado, será utilizado o conjunto padrão como referência 
 * @param {Member} member Membro
 * @param {number} weight Peso
 * @param {string} type Tipo de membro
 * @param {RoleSet} roleset Conjunto de funções
 */
function IncreaseAllRoleCooldown(member:Member,weight:number,type:MemberType,roles?:Array<string>){
    if(roles == undefined){
        switch(type) {
            case MemberType.ACOLYTE:
                roles = Object.keys(Roles.defaultAcolyteRoles); break
            case MemberType.COROINHA:
                roles = Object.keys(Roles.defaultCoroinhaRoles); break
        }
    }
    roles.forEach((role) => {
        member.rodizio[role]+=weight
    })
}
/** Aumenta a prioridade geral de todos os membros, salvo exceções, por determinado peso
 * 
 * @param exceptions Exceções
 * @param weight Peso
 */
function IncreaseAllGeneralPriority(exceptions:Array<Member>,weight:number,type:MemberType){
    let members:Array<Member> = []

    switch(type) {
        case MemberType.ACOLYTE:
            members = MemberData.allAcolytes; break
        case MemberType.COROINHA:
            members = MemberData.allCoroinhas; break
        default: console.error("Invalid type"); break
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
function IncreaseAllDayPriority(exceptions:Array<Member>,day:string,weight:number,type:MemberType) {
    let members:Array<Member> = []

    switch(type) {
        case MemberType.ACOLYTE:
            members = MemberData.allAcolytes; break
        case MemberType.COROINHA:
            members = MemberData.allCoroinhas; break
        default: console.error("Invalid type"); break
    }
    
    for(let i = 0; i < members.length;i++) {
        let curMember = members[i]

        if(!HasMember(curMember,exceptions)){
            curMember.weekendPriority[day]+=weight
        }
    }
}



/** Retorna uma lista com os membros com maior prioridade geral.
 * 
 * @param {Array<Member>} members Lista de membros
 * @returns {Array<Member>} Membros priorizados
 */
function GetPrioritizedMembers(members:Array<Member>):Array<Member>{
    let prioritized:Array<Member> = []
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