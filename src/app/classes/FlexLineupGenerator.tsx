import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Acolyte, AcolyteData } from "./AcolyteData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleLineupScreen } from "../screens/SingleLineup";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { CoroinhaLineup } from "./CoroinhaLineup";
import { GetMemberIndex, GetRandom, RemoveMemberFromList as RemoveMember, SaveAcolyteData, SaveCoroinhaData, SortByNumber } from "./Methods";
import { FlexLineup } from "./FlexLineup";


export function GenerateLineup(weekend:any=null,day:any=null,roles:string[],type:string){
    // FEITO: Algoritmo está mais limpo, legível, eficiente e curto
    // FEITO: Bolar alguma forma de manter o rodízio de dias, mas aleatorizar as escalações,
    //       principalmente as escalações "quadradas" (4 funções, total de coroinhas múltiplo de 4)
    // FEITO: A geração de escalas agora é flexivel através da classe e tipo FlexLineupGenerator e FlexLineup
    // Existem funções da classe Methods que fazem a conversão entre tipos flexíveis e específicos.

    // TODO: Resolver clássico bug do 'rodizio' of undefined (eu vou ficar louco :D). Agora está acontecendo
    // Ao criar 3 escalas de acólitos de solenidade seguidas como single lineup no mesmo dia e horário. Não sei mais se
    // é só um erro com a atribuição de prioridades, mas está próximo. UPDATE: Bug simplesmente não aconteceu mais :D.
    // Logo temos um código roleta russa que pode bugar do nada e sabe se lá como vai debugar isso.
    // TODO Por algum raio de motivo, as prioridades não estão sendo atualizadas. 
    // Provavelmente porque está sendo usado uma cópia da lista, fazer funções que alterem os membros na lista original
    // com os novos dados dos membros da lista clonada.


    // Excluir membros fora de escala e incompatíveis com dia e horário
    
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

    // Fazer um mapa com os coroinhas por prioridade horária
    let dayPriority = new Map()
    OrganizeByDayPriority(dayPriority,members,day)
    dayPriority = SortPriorityMap(dayPriority)

    // Escolher coroinhas com prioridade máxima (dia + geral)
    let maxPriority:Array<Coroinha|Acolyte> = []
    if(day == "Outro"){
        maxPriority = GeneralPrioritizedMembers(generalPriority,roles.length)
    }
    else{
        maxPriority = PrioritizedMembers(generalPriority,dayPriority,roles.length)
    }

    // Escolher funções para cada coroinha e montar na classe Lineup.
    let newLineup:FlexLineup = new FlexLineup()
    
    roles.forEach((role) => {
        let chosenMembers:Array<Coroinha|Acolyte> = GetRolePrioritizedMembers(maxPriority,role)

        let member:Coroinha|Acolyte = GetRandom(chosenMembers)
        if(type == "coroinha"){
            member.rodizio[role] = 4
        }
        else if(type == "acolito"){
            member.rodizio[role] = 6 // TODO Alterar isso pra adaptar de acordo com o tamanho das funções. Tentar corrigir o mesmo para os coroinhas.
        }

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

        //CommitMemberInfo(member)
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

/** Gera uma nova escala aleatória podendo se basear em dia e fim de semana ou não. 
 * Não afeta e nem leva em conta nenhum tipo de preferência e prioridade, apenas disponibilidade.
 *  
 * @param roles Funções
 * @param weekend Fim de semana
 * @param day Dia
 * @returns Uma nova escala aleatória
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
 * Remove os coroinhas que não estão disponíveis no dia e fim de semana ou que estão fora da escala.
 * @param {Array<Coroinha>} members lista de coroinhas @param {string} day dia @param {string} weekend fim de semana 
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

/** Retorna uma lista sem os coroinhas que já foram escalados nesse fim de semana.
 * Caso a lista seja menor do que a quantidade necessária de coroinhas, os coroinhas
 * removidos serão readicionados à lista de disponíveis, levando em conta prioridade geral,
 * até que ela atinja a quantidade mínima.
 * Com o parâmetro de aleatoriedade Aleatoriedade for verdadeiro, escolherá coroinhas aleatórios que foram removidos. Quando falso, escolherá os coroinhas com maior prioridade que foram removidos
 * 
 * @param members Lista de coroinhas
 * @param weekend Final de semana
 * @param min Mínimo de coroinhas necessários
 * @param randomness Aleatoriedade
 * @returns Lista com os coroinhas disponíveis
 */
function RemoveIfAlreadyOnWeekend(members:Array<Coroinha|Acolyte>,weekend:string,min:number,randomness:boolean = true){
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
 * @param priorityMap Mapa com as prioridades
 * @param members Todos os membros
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
 * @param priorityMap Mapa de prioridades
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
 * Separa os coroinhas dentro do mapa de prioridade diária.
 * @param priorityMap Mapa com as prioridades
 * @param members Todos os coroinhas
 * @param day Dia da escala
 */
function OrganizeByDayPriority(priorityMap:Map<string,Array<Coroinha|Acolyte>>,members:Array<Coroinha|Acolyte>,day:string){
    members.forEach((coroinha) =>{
        let priority:number = coroinha.weekendPriority[day]
        if(priority < 0){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("very-high-priority")
            if(map == undefined){
                priorityMap.set("very-high-priority",[coroinha])
            }
            else{
                map.push(coroinha)
            }
        }
        if(priority >= 0 && priority <= 2){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("high-priority")
            if(map == undefined){
                priorityMap.set("high-priority",[coroinha])
            }
            else{
                map.push(coroinha)
            }
        }
        if(priority > 2){
            let map:Array<Coroinha|Acolyte>|undefined = priorityMap.get("low-priority")
            if(map == undefined){
                priorityMap.set("low-priority",[coroinha])
            }
            else{
                map.push(coroinha)
            }
        }
    })
}

/** Seleciona os coroinhas com maior prioridade levando em conta as prioridades gerais e diárias já separadas.
 * Esta seleção prioriza a prioridade geral em seguida a prioridade diária.
 * 
 * @param genPriority Mapa com as prioridades gerais
 * @param dayPriority Mapa com as prioridade diárias
 * @param amount Quantidade de coroinhas desejada
 * @returns Uma lista de coroinhas com a maior priorade possível baseada na prioridade geral e diária.
 */

function PrioritizedMembers(genPriority:Map<any,any>,dayPriority:Map<any,any>,amount:number){
    let dayKeys = Array.from(dayPriority.keys())
    let priorities = Array.from(genPriority.keys())

    let prioritized:Array<Coroinha|Acolyte> = [] // Coroinhas com prioridade máxima
    let curGenPrio = 0 // Prioridade geral sendo checada
    let curDayPrio = 0 // Prioridade diária sendo checada

    while(prioritized.length < amount){ // Enquanto não houver a quantidade desejada de coroinhas escolhidos:
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

/** Seleciona os coroinhas com maior prioridade levando em conta apenas as prioridades gerais.
 * 
 * @param genPriority Mapa com as prioridades gerais
 * @param amount Quantidade mínima de coroinhas desejada
 * @returns Uma lista de coroinhas priorizados.
 */
function GeneralPrioritizedMembers(genPriority:Map<any,any>,amount:number){
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

/** Retorna uma lista com os coroinhas que possuem a maior prioridade por função.
 * 
 * @param members Lista de coroinhas
 * @param role Função
 * @returns Lista com os coroinhas com maior prioridade na função
 */
function GetRolePrioritizedMembers(members:Array<Coroinha|Acolyte>,role:string){
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
 * @param member Membro
 * @param weight Peso
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
/** Reduz a prioridade geral de todos os coroinhas, salvo exceções, por determinado peso
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
 * Reduz a prioridade diária de todos os coroinhas por determinado peso, salvo excessões.
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

/** Verifica se na lista há ou não um determinado coroinha
 * 
 * @param member Coroinha a procurar
 * @param array Lista de coroinhas
 * @returns Coroinha está na lista
 */
function HasMember(member:Coroinha|Acolyte,array:Array<Coroinha|Acolyte>): Boolean{
    for(let i = 0; i < array.length;i++){
        if(array[i] == member){
            return true
        }
    }

    return false
}

/** Retorna uma lista com os coroinhas com maior prioridade geral.
 * 
 * @param members Lista de coroinhas
 * @returns Coroinhas priorizados
 */
function GetPrioritizedMembers(members:Array<Coroinha|Acolyte>){
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
 * @param member Membro
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