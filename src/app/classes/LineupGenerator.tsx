import { DistinctRandomNumbers, GetRandom, RandomNumber, RemoveMemberFromList as RemoveMember, HasMember, ShuffleArray, GetMemberArray } from "./Methods";
import { Member, MemberData, MemberType, SaveAcolyteData, SaveCoroinhaData } from "./MemberData";
import { Roles, RoleSet } from "./Roles";
import { Lineup } from "./Lineup";
import { useEffect } from "react";
import { generationStore } from "../store/store";

/**
 *  Armazena dados temporários da geração de escalas
 */
export class GenerationCache {
    static lineups:Array<Lineup> = []
    static curIndex:number = 0
    static discardedMembers:Array<Member> = []

    static IncrementIndex = ()=>{
        this.curIndex++
    }

    static ResetIndex = ()=>{
        this.curIndex = 0
    }
    
    static ResetLineups = ()=>{
        this.lineups = []
    }

    static ResetDiscardedMembers() {
        this.discardedMembers = []
    }

    static AddLineup = (line:Lineup)=>{
        this.lineups.push(line)
        this.IncrementIndex()
    }

    static ClearAllMemberCache = ()=>{
        MemberData.allAcolytes.forEach((acolyte)=>{
            acolyte.selectedOnLineups = []
        })
        MemberData.allCoroinhas.forEach((coroinha)=>{
            coroinha.selectedOnLineups = []
        })
    }
    static Reset = ()=>{
        this.ResetIndex()
        this.ResetLineups()
        this.ClearAllMemberCache()
        this.ResetDiscardedMembers()
    }
}
type GeneratorSettings = {
    members:Array<Member>
    weekend:string
    day:string
    roleset:RoleSet
    type:MemberType
    place?:string
    randomness?:number
    
}
/** Gera uma nova escala de acordo com o tipo (Acólito/Coroinha), fim de semana e dia dadas as funções.
 * Leva em conta a disponibiliade e as prioridades diárias, de funções e gerais.
 * 
 * @param members Membros selecionados
 * @param weekend Final de semana
 * @param day Dia
 * @param roleset Conjunto de funções
 * @param type Tipo
 * @param place Local (opcional)
 * @param randomness Aleatoriedade (opcional)
 * 
 * @returns {Lineup|null} Nova escala montada
 */
export function GenerateLineup(settings:GeneratorSettings):Lineup|null{
    let members:Array<Member> = settings.members.slice()
    if(members == null){
        console.error("Empty list")
        return null
    }

    members = RemoveUnvailable(members,settings.day,settings.weekend,settings.place) // Remover membros indisponíveis
    if(members.length == 0){ // Não há membros disponíveis
        console.warn("Any members available. Lineup is empty.")
        return EmptyLineup(settings.day,settings.weekend,settings.roleset)      
    }
    // Excluir membros que já estão nesse fim de semana
    if(settings.weekend != "Outro"){
        members = RemoveIfAlreadyOnWeekend(members,settings.weekend,settings.roleset.size)
    }
    
    ShuffleArray(members) // Embaralha o array para aumentar a aleatoriedade

    members.forEach((member)=>{
        CalculateScore(member,settings.day)
    })

    let sortedScoreMembers:Array<Member> = []; // Lista ordenada por score.
    
    members.forEach((member)=>{
        InsertSortedByScore(member,sortedScoreMembers) // Insere ordenado
    })
    
    let chosenMembers:Array<Member> = [] // Lista de membros selecionados
    
    let chosenQuant:number = Math.ceil(settings.roleset.size*settings.randomness) < sortedScoreMembers.length ? Math.ceil(settings.roleset.size * settings.randomness) : sortedScoreMembers.length // Quantidade de membros a selecionar
    let chosenIndexes = DistinctRandomNumbers(0,chosenQuant-1,chosenQuant)

    for(let i = 0; i < settings.roleset.size;i++){
        let chosen = sortedScoreMembers[chosenIndexes[i]]
        if(chosen == null){continue}
        chosenMembers.push(chosen)
    }

    // Escolher funções para cada membro e montar na classe Lineup.
    let newLineup:Lineup = new Lineup()

    for(let i = 0; i < settings.roleset.size; i++){
        let role = settings.roleset.set[i]
        
        let chosenForRole:Array<Member> = GetRolePrioritizedMembers(chosenMembers,role)
        let member:Member = GetRandom(chosenForRole)
        
        IncreaseAllRoleCooldown(member,1,settings.type,Object.keys(member.rodizio))
        member.rodizio[role] = 0
        
        newLineup.line[role] = member
        newLineup.members.push(member)

        // Relacionando índice da escala ao membro
        member.selectedOnLineups.push(GenerationCache.curIndex) 

        RemoveMember(member,chosenMembers)

        if(chosenMembers.length == 0 && i+1 < settings.roleset.size){
            console.warn("Not enough members! Only partial lineup will be generated.")
            break;
        }
    }
    
    newLineup.day = settings.day
    newLineup.weekend = settings.weekend
    newLineup.roleset = settings.roleset
    newLineup.place = settings.place
    newLineup.members.forEach((member:Member) => {
        member.priority = 0
        member.weekendPriority[settings.day] = 0
        member.lastWeekend = settings.weekend
    });

    // Ajustar prioridades
    if(settings.day != "Outro"){
        IncreaseAllDayPriority(newLineup.members,settings.day,1,settings.type)
        IncreaseAllGeneralPriority(newLineup.members,1,settings.type)
        IncreaseAllPlacePriority(newLineup.members,settings.place,1,settings.type)
    }

    // Salvar listas
    switch(settings.type){
        case MemberType.ACOLYTE:  SaveAcolyteData(); break
        case MemberType.COROINHA: SaveCoroinhaData(); break
    }

    GenerationCache.AddLineup(newLineup)
    return newLineup
}

/** Gera uma nova escala aleatória podendo se basear em dia e fim de semana ou não. 
 * Não afeta e nem leva em conta nenhum tipo de preferência e prioridade, apenas disponibilidade.
 *  
 * @param {RoleSet} roles Conjunto de funções
 * @param {string} weekend Fim de semana
 * @param {string} day Dia
 * @returns {Lineup} Uma nova escala aleatória
 */
export function GenerateRandomLineup(roleset:RoleSet,type?:MemberType,weekend:string="Outro",day:string="Outro",place?:string):Lineup{  
    let members:Array<Member> = GetMemberArray(type).slice()

    let availableMembers = []

    availableMembers = RemoveUnvailable(members,"Outro","Outro",place)

    let generatedLineup = new Lineup()
    for(let i = 0; i < roleset.size;i++){
        let curRole:string = roleset.set[i]
        let curMemberIndex:number = RandomNumber(0,availableMembers.length-1)
        let curMember:Member = availableMembers[curMemberIndex]
        
        generatedLineup.line[curRole] = curMember
        generatedLineup.members.push(curMember)
        availableMembers.splice(curMemberIndex,1)
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend
    generatedLineup.roleset = roleset
    generatedLineup.place = place
    return generatedLineup
}

/**
 * Calcula a pontuação (score) de um membro baseado em sua prioridade geral e na prioridade do dia.
 * A prioridade geral tem peso quadrático. A prioridade diária tem peso simples.
 * @param member Membro
 * @param day Dia
 */
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
function RemoveUnvailable(members:Array<Member>,day:string,weekend:string,place:string){
    let availableMembers = []

    for(let i = 0; i < members.length;i++){
        let curMember = members[i]

        if(curMember.onLineup){
            if(day != "Outro" && weekend != "Outro"){
                if(curMember.disp[weekend][day]){
                    if( (place == undefined) || (place != undefined && curMember.placeDisp[place])){
                        availableMembers.push(curMember)
                        continue
                    }
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
 * 
 * Em caso de falta de membros, com o parâmetro de aleatoriedade(randomness) verdadeiro, 
 * escolherá aleatoriamente mebros que foram removidos. 
 * Quando falso, escolherá os com maior prioridade.
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

    members.forEach((member) => { // Encontra o maior número (prioridade)
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

/** Aumenta as prioridades das funções de um membro por um determinado peso.
 *  Caso o conjunto não seja determinado, será utilizado o conjunto padrão como referência 
 * @param {Member} member Membro
 * @param {number} weight Peso
 * @param {string} type Tipo de membro
 * @param {RoleSet} roles Funções
 */
function IncreaseAllRoleCooldown(member:Member,weight:number,type:MemberType,roles?:Array<string>){
    if(roles == undefined){
        switch(type) {
            case MemberType.ACOLYTE:  roles = Object.keys(Roles.defaultAcolyteRoles); break
            case MemberType.COROINHA: roles = Object.keys(Roles.defaultCoroinhaRoles); break
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
 * @param type OPCIONAL: tipo de membro
 */
function IncreaseAllGeneralPriority(exceptions:Array<Member>,weight:number,type?:MemberType){
    let members:Array<Member> = GetMemberArray(type)

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
 * @param type OPCIONAL: tipo de membro
 */
function IncreaseAllDayPriority(exceptions:Array<Member>,day:string,weight:number,type?:MemberType) {
    let members:Array<Member> = GetMemberArray(type)

    for(let i = 0; i < members.length;i++) {
        let curMember = members[i]

        if(!HasMember(curMember,exceptions)){
            curMember.weekendPriority[day]+=weight
        }
    }
}

/**
 * Aumenta a prioridade do local de
 * todos os membros por determinado peso, salvo excessões.
 * @param exceptions Excessões
 * @param place Local
 * @param weight Peso
 * @param type tipo de membro
 */
function IncreaseAllPlacePriority(exceptions:Array<Member>,place:string,weight:number,type?:MemberType) {
    let members:Array<Member> = GetMemberArray(type)

    for(let i = 0; i < members.length;i++) {
        let curMember = members[i]

        if(!HasMember(curMember,exceptions)){
            curMember.placeRotation[place]+=weight
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

/**
 * Retorna uma nova escala sem membros
 * @param day Dia
 * @param weekend Fim de semana
 * @param roleset Conjunto de funções
 * @returns 
 */
function EmptyLineup(day:string, weekend:string, roleset:RoleSet):Lineup{
    let emptyLine = new Lineup()
    emptyLine.day = day
    emptyLine.weekend = weekend
    emptyLine.roleset = roleset
    
    return emptyLine
}

/** 
 * Checa se o membro está disponível para a escala.
 * 
 * @param member Membro
 * @param lineup Escala
 */
function IsMemberAvailable(member:Member,lineup:Lineup){
    return member.onLineup && 
    !lineup.members.includes(member) &&
    member.disp[lineup.weekend][lineup.day] && 
    (lineup.place == undefined || member.placeDisp[lineup.place])
}

/**
 * Balanceia as escalas do buffer de geração atual (GenerationBuffer)
 * entre os membros
 * @param members Membros que serão balanceados
 * @returns Essa função altera diretamente as escalas no buffer.
 */
export function BalanceLineups(members:Array<Member>){
    let timesSelected = SortByTimesSelected(members)
    let times = [] // Conjunto contendo quantas vezes os membros foram escalados

    Object.keys(timesSelected).forEach((time)=>{
        times.push(Number(time))
    })
    
    let min = 0
    let max = times.length-1
    let diff = times[max]-times[min]
    
    // Explicitando caso base:
    if(diff < 2){return}

    while (min < max){
        diff = times[max]-times[min]
        
        if(diff < 2){break} // Caso base implícito
        let least:Array<Member> = timesSelected[times[min]]
        let most:Array<Member> = timesSelected[times[max]]

        // Tentar trocar os que foram mais escalados pelos que foram menos
        BalanceTwoClasses(least,most)

        if(least.length > 0 && ((times[max-1]-times[min]) >= 2)){
            max--
        }
        else{
            let nextMembers = members.filter((member) => !least.includes(member))
            GenerationCache.discardedMembers = GenerationCache.discardedMembers.concat(members.filter((member) => least.includes(member)))
            return BalanceLineups(nextMembers) // Caso recursivo
        }
    }  
}

/**
 * Separa os membros em um objeto por quantidade de vezes escalados
 * o objeto também armazena o valor mínimo e máximo da quantidade de vezes
 * nos campos "min" e "max" respectivamente.
 * 
 * @param members Membros
 * @returns Objeto com os membros separados por vezes escalados
 */
function SortByTimesSelected(members:Array<Member>,removeZero?:boolean):object{
    let timesSelected = {}

    for(let i = 0; i < members.length; i++){
        let curMember:Member = members[i]
        
        //if(!curMember.onLineup){continue}

        let selected = curMember.selectedOnLineups.length

        if(timesSelected[selected] == undefined){
            timesSelected[selected] = [curMember]
        }
        else{
            timesSelected[selected].push(curMember)
        }
    }
    if(removeZero){
        delete timesSelected["0"]
    }
    return timesSelected
}

/**
 * Faz o balanceamento entre duas listas: uma menor e outra maior
 * @param least Menor lista
 * @param most Maior lista
 * @returns 
 */
function BalanceTwoClasses(least:Array<Member>,most:Array<Member>) {
    // Explicitando caso base da recursão
    if(least.length == 0 || most.length == 0){
        return
    }

    for(let i = 0; i < least.length;i++){
        let replacing:Member = least[i]

        for(let h = 0; h < most.length;h++){
            let toReplace:Member = most[h]
            let lineupsToCompare = toReplace.selectedOnLineups

            for(let j = 0; j < lineupsToCompare.length; j++){
                let curLine:Lineup = GenerationCache.lineups[lineupsToCompare[j]]
                if(IsMemberAvailable(replacing,curLine)){
                    curLine.ReplaceMember(curLine.GetMemberRole(toReplace),replacing)
                    toReplace.selectedOnLineups.splice(toReplace.selectedOnLineups.indexOf(lineupsToCompare[j]),1)
                    replacing.selectedOnLineups.push(lineupsToCompare[j])
                    
                    least.splice(least.indexOf(replacing),1)
                    most.splice(most.indexOf(toReplace),1)

                    return BalanceTwoClasses(least,most) // Caso recursivo sobre a lista atualizada.
                }
            }
        }
    }
}

/**
 * Tenta balancear os membros que foram descartados no primeiro balanceamento.
 * @param members Todos os membros
 */
export function BalanceDiscarded(members:Array<Member>) {
    for(let i = 0; i < members.length; i++){
        let toReplace:Member = members[i] // Membro a ser possivelmente substituído

        for(let j = 0; j < GenerationCache.discardedMembers.length; j++) {
            let replacing:Member = GenerationCache.discardedMembers[j] // Membro que possivelmente substituirá
            
            if(replacing.name == toReplace.name){continue} // Se for o mesmo membro, continua.

            let lineupsToReplace = toReplace.selectedOnLineups
            if((lineupsToReplace.length - replacing.selectedOnLineups.length) >= 2) {
                for(let k = 0; k < lineupsToReplace.length; k++){
                    let curLine:Lineup = GenerationCache.lineups[lineupsToReplace[k]]
                    if(IsMemberAvailable(replacing,curLine)){
                        curLine.ReplaceMember(curLine.GetMemberRole(toReplace),replacing)
                        toReplace.selectedOnLineups.splice(toReplace.selectedOnLineups.indexOf(lineupsToReplace[j]),1)
                        replacing.selectedOnLineups.push(lineupsToReplace[j])
                    }
                }
            }
        }
    }
}