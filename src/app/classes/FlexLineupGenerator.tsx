import { Acolyte, AcolyteData } from "./AcolyteData";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { GetMemberIndex, GetRandom, RemoveMemberFromList as RemoveMember, SaveAcolyteData, SaveCoroinhaData, SortByNumber } from "./Methods";
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
export function GenerateLineup(weekend:any=null,day:any=null,roles:string[],type:string):FlexLineup|null{
    // Excluir membros fora de escala e incompatíveis com dia e horário
    // TODO corrigir erro quando não há membros suficiente disponíves. (Está dando erro na função de selecionar membro por prioridade de função)
    let members:Array<Coroinha|Acolyte> = []

    if(type == "coroinha"){
        members = CoroinhaData.allCoroinhas.slice()
    }
    else if(type == "acolito"){
        members = AcolyteData.allAcolytes.slice()
    }
    else{
        console.error("Invalid type.")
        return null
    }

    members = RemoveUnvailable(members,day,weekend)

    // Excluir membros que já estão nesse fim de semana
    if(weekend != "Outro"){
        members = RemoveIfAlreadyOnWeekend(members,weekend,roles.length)
    }
    
    // Fazer um mapa com os membros por prioridade geral
    let generalPriority = new Map()
    OrganizeByPriority(generalPriority,members)
    generalPriority = SortPriorityMap(generalPriority)

    // Fazer um mapa com os membros por prioridade horária
    let dayPriority = new Map()
    OrganizeByDayPriority(dayPriority,members,day)
    dayPriority = SortPriorityMap(dayPriority)

    // Escolher membros com prioridade máxima (dia + geral)
    let maxPriority:Array<Coroinha|Acolyte> = []
    if(day == "Outro"){
        maxPriority = GeneralPrioritizedMembers(generalPriority,roles.length)
    }
    else{
        maxPriority = PrioritizedMembers(generalPriority,dayPriority,roles.length)
    }

    // Escolher funções para cada membro e montar na classe FlexLineup.
    let newLineup:FlexLineup = new FlexLineup()
    
    roles.forEach((role) => {
        let chosenMembers:Array<Coroinha|Acolyte> = GetRolePrioritizedMembers(maxPriority,role)

        let member:Coroinha|Acolyte = GetRandom(chosenMembers)

        member.rodizio[role] = roles.length
        
        ReduceAllFunctionCooldown(member,1,type)
        newLineup.line.set(role,member)
        newLineup.members.push(member)
        
        RemoveMember(member,maxPriority)
    })
    
    newLineup.day = day
    newLineup.weekend = weekend

    newLineup.members.forEach((member:Coroinha|Acolyte) => {
        member.priority = 4
        member.weekendPriority[day] = 4
        member.lastWeekend = weekend
    });

    // Ajustar prioridades
    if(day != "Outro"){
        ReduceAllDayPriority(newLineup.members,day,1,type)
        ReduceAllGeneralPriority(newLineup.members,1,type)
    }

    // Salvar listas
    if(type == "coroinha"){
        SaveCoroinhaData()
    } 
    else{
        SaveAcolyteData()
    }

    // Saída
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

    if(type == "coroinha"){
        members = CoroinhaData.allCoroinhas.slice()
    }
    else if(type == "acolito"){
        members = AcolyteData.allAcolytes.slice()
    }

    let availableMembers = []

    availableMembers = RemoveUnvailable(members,"Outro","Outro")

    let generatedLineup = new FlexLineup()
    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]
        let curMember = GetRandom(availableMembers)

        generatedLineup.line.set(curRole,curMember)
        generatedLineup.members.push(curMember)
        availableMembers.splice(availableMembers.indexOf(curMember),1)
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend
    return generatedLineup
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

/**
 * Separa os membros dentro do mapa de prioridade geral.
 * @param {Map<string,Array<Coroinha|Acolyte>>} priorityMap Mapa com as prioridades
 * @param {Array<Coroinha|Acolyte>} members Todos os membros
 */
function OrganizeByPriority(priorityMap:Map<string,Array<Coroinha|Acolyte>>,members:Array<Coroinha|Acolyte>){
    
    for(let i = 0; i < members.length;i++){
        let curMember = members[i]
        
        if(curMember.priority < 0){
            let map = priorityMap.get("very-high-priority")
            if(map != undefined){
                map!.push(curMember)
            }
            else{
                priorityMap.set("very-high-priority",[curMember])
            }
        }
        if(curMember.priority >= 0 && curMember.priority <= 3){
            let map = priorityMap.get("high-priority")
            if(map != undefined){
                map!.push(curMember)
            }
            else{
                priorityMap.set("high-priority",[curMember])
            }
        }

        else if(curMember.priority > 3){
            let map = priorityMap.get("low-priority")
            if(map != undefined){
                map!.push(curMember)
            }
            else{
                priorityMap.set("low-priority",[curMember])
            }
            
        }
    }
}

/** Organiza o mapa de prioridades da maior para a menor prioridade.
 * 
 * @param {Map<string,Array<Coroinha|Acolyte>>} priorityMap Mapa de prioridades
 */
function SortPriorityMap(priorityMap:Map<string,Array<Coroinha|Acolyte>>){
    let sorted:Map<string,Array<Coroinha|Acolyte>> = new Map<string,Array<Coroinha|Acolyte>>()
    let priorities = ["very-high-priority","high-priority","low-priority"] // Prioridades em ordem

    priorities.forEach((priority) => {
        let array = priorityMap.get(priority)
        if(priorityMap.get(priority) != undefined){
            sorted.set(priority,array!)
        }
    })
    
    return sorted
}

/**
 * Separa os membros dentro do mapa de prioridade diária.
 * @param {Map<string,Array<Coroinha|Acolyte>>} priorityMap Mapa com as prioridades
 * @param {Array<Coroinha|Acolyte>} members Todos os membros
 * @param {string} day Dia da escala
 */
function OrganizeByDayPriority(priorityMap:Map<string,Array<Coroinha|Acolyte>>,members:Array<Coroinha|Acolyte>,day:string){
    members.forEach((members) =>{
        let priority:number = members.weekendPriority[day]
        if(priority < 0){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("very-high-priority")
            if(map == undefined){
                priorityMap.set("very-high-priority",[members])
            }
            else{
                map.push(members)
            }
        }
        if(priority >= 0 && priority <= 2){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("high-priority")
            if(map == undefined){
                priorityMap.set("high-priority",[members])
            }
            else{
                map.push(members)
            }
        }
        if(priority > 2){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("low-priority")
            if(map == undefined){
                priorityMap.set("low-priority",[members])
            }
            else{
                map.push(members)
            }
        }
    })
}

/** Seleciona os membros com maior prioridade levando em conta as prioridades gerais e diárias já separadas.
 * Esta seleção prioriza a prioridade geral em seguida a prioridade diária.
 * 
 * @param {Map<any,any>} genPriority Mapa com as prioridades gerais
 * @param {Map<any,any>} dayPriority Mapa com as prioridade diárias
 * @param {number} amount Quantidade de membros desejada
 * @returns {Array<Coroinha|Acolyte>} Uma lista de membros com a maior priorade possível baseada na prioridade geral e diária.
 */

function PrioritizedMembers(genPriority:Map<any,any>,dayPriority:Map<any,any>,amount:number):Array<Coroinha|Acolyte>{
    let dayKeys = Array.from(dayPriority.keys())
    let priorities = Array.from(genPriority.keys())

    let prioritized:Array<Coroinha|Acolyte> = [] // Cembros com prioridade máxima
    let curGenPrio = 0 // Prioridade geral sendo checada
    let curDayPrio = 0 // Prioridade diária sendo checada

    while(prioritized.length < amount){ // Enquanto não houver a quantidade desejada de membros escolhidos:
        let genArray = genPriority.get(priorities[curGenPrio]) // Lista atual da prioridade geral
        let dayArray = dayPriority.get(dayKeys[curDayPrio]) // Lista atual da prioridade diária

        for(let i = 0; i < genArray.length;i++){
            let genMember = genArray[i]
            
            for(let j = 0; j < dayArray.length; j++){
                let dayMember = dayArray[j]
                if(genMember == dayMember){ // Se encontrou iguais, é porque têm a maior prioridade possível nas duas listas
                    prioritized.push(genMember)
                }
            }
        }

        if(prioritized.length < amount){
            if(curDayPrio < dayKeys.length-1){
                curDayPrio++
                continue
            }
            else{
                if(curGenPrio < priorities.length-1){
                    curGenPrio++
                    curDayPrio = 0
                    continue
                }
                else{
                    console.error("Not enough members for full lineup!")
                    break
                }
            }
        }
    }
    return prioritized
}

/** Seleciona os membros com maior prioridade levando em conta apenas as prioridades gerais.
 * 
 * @param {Map<any,any>} genPriority Mapa com as prioridades gerais
 * @param {number} amount Quantidade mínima de membros desejada
 * @returns {Array<Coroinha|Acolyte>} Uma lista de membros priorizados.
 */
function GeneralPrioritizedMembers(genPriority:Map<any,any>,amount:number):Array<Coroinha|Acolyte>{
    let prioritized:Array<Coroinha|Acolyte> = []
    let curGenPrio = 0
    let genKeys = Array.from(genPriority.keys())
    while(prioritized.length < amount){
        let genArray = genPriority.get(genKeys[curGenPrio])
        
        genArray.array.forEach((member:Coroinha|Acolyte) => {
            prioritized.push(member)
        });
    }

    return prioritized
}

/** Retorna uma lista com os membros que possuem a maior prioridade por função.
 * 
 * @param {Array<Coroinha|Acolyte>} members Lista de membros
 * @param {string} role Função
 * @returns {Array<Coroinha|Acolyte>} Lista com os membros com maior prioridade na função
 */
function GetRolePrioritizedMembers(members:Array<Coroinha|Acolyte>,role:string):Array<Coroinha|Acolyte>{
    let prioritized:Array<Coroinha|Acolyte> = []
    let smallest:number = members[0].rodizio[role]

    members.forEach((member) => {
        let prio = member.rodizio[role]
        if(prio < smallest){
            smallest = prio
        }
    })

    members.forEach((member)=>{
        if(member.rodizio[role] == smallest){
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
function ReduceAllFunctionCooldown(member:Coroinha|Acolyte,weight:number,type:string){
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
/** Reduz a prioridade geral de todos os membros, salvo exceções, por determinado peso
 * 
 * @param exceptions Exceções
 * @param weight Peso
 */
function ReduceAllGeneralPriority(exceptions:Array<Coroinha|Acolyte>,weight:number,type:string){
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
            curMember.priority = curMember.priority-1
        }
    }
}

/**
 * Reduz a prioridade diária de todos os membros por determinado peso, salvo excessões.
 * @param exceptions Excessões
 * @param day Dia
 * @param weight Peso
 */
function ReduceAllDayPriority(exceptions:Array<Coroinha|Acolyte>,day:string,weight:number,type:string){
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
            curMember.weekendPriority[day]-=weight
        }
    }
}

/** Verifica se na lista há ou não um determinado membro.
 * 
 * @param member Membro a procurar
 * @param array Lista de membros
 * @returns Membro está na lista
 */
function HasMember(member:Coroinha|Acolyte,array:Array<Coroinha|Acolyte>): Boolean{
    for(let i = 0; i < array.length;i++){
        if(array[i] == member){
            return true
        }
    }

    return false
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

/** Aplica as mudanças feitas em uma cópia de membro no membro original.
 * 
 * @param {Coroinha|Acolyte} member Membro
 */
function CommitMemberInfo(member:Coroinha|Acolyte){
    let originalList:Array<Coroinha|Acolyte> = [] // Lista de membro original (acólitos ou coroinhas)
    let indexOnOriginal:number = 0 // Índice do membro na lista original
    
    if(member.TYPE == "Coroinha"){
        originalList = CoroinhaData.allCoroinhas
    }
    
    else if(member.TYPE == "Acolyte"){
        originalList = AcolyteData.allAcolytes
    }

    else{
        console.error("Failed to commit member info. Invalid member type. Expected: \"Coroinha\" or \"Acolyte\", got \"",member.TYPE,"\"")
    }

    indexOnOriginal = GetMemberIndex(member,originalList)
   
    if(indexOnOriginal != -1){
        originalList[indexOnOriginal] = member
    }
}