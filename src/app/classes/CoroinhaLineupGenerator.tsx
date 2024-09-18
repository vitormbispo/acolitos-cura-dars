import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Acolyte, AcolyteData } from "./AcolyteData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleLineupScreen } from "../screens/SingleLineup";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { CoroinhaLineup } from "./CoroinhaLineup";
import { GetRandom, RemoveMemberFromList as RemoveCoroinha, SortByNumber } from "./Methods";


export function GenerateLineup(weekend:any=null,day:any=null,roles:string[]){
    // FEITO: Algoritmo está mais limpo, legível, eficiente e curto
    // TODO: Bolar alguma forma de manter o rodízio de dias, mas aleatorizar as escalações,
    //       principalmente as escalações "quadradas" (4 funções, total de coroinhas múltiplo de 4)
    
    // Excluir coroinhas fora de escala e incompatíveis com dia e horário
    
    let coroinhas = CoroinhaData.allCoroinhas.slice()
    
    console.log("Before 1st removal")
    coroinhas.forEach((coroinha) =>{
        console.log(coroinha.nick)
    })
    coroinhas = RemoveUnvailable(coroinhas,day,weekend)
    console.log("\n After")
    coroinhas.forEach((coroinha) =>{
        console.log(coroinha.nick)
    })
    

    // Excluir coroinhas que já estão nesse fim de semana
    if(weekend != "Outro"){
        coroinhas = RemoveIfAlreadyOnWeekend(coroinhas,weekend,roles.length)
    }
    console.log("\n After")
    coroinhas.forEach((coroinha) =>{
        console.log(coroinha.nick)
    })

    // Fazer um mapa com os coroinhas por prioridade geral
    let generalPriority = new Map()
    OrganizeByPriority(generalPriority,coroinhas)
    generalPriority = SortPriorityMap(generalPriority)

    // Fazer um mapa com os coroinhas por prioridade horária
    let dayPriority = new Map()
    OrganizeByDayPriority(dayPriority,coroinhas,day)
    dayPriority = SortPriorityMap(dayPriority)

    // Escolher coroinhas com prioridade máxima (dia + geral)
    let maxPriority:Array<Coroinha> = []
    if(day == "Outro"){
        maxPriority = GeneralPrioritizedCoroinhas(generalPriority,roles.length)
    }
    else{
        maxPriority = PrioritizedCoroinhas(generalPriority,dayPriority,roles.length)
    }

    // Escolher funções para cada coroinha e montar na classe Lineup.
    let newLineup:CoroinhaLineup = new CoroinhaLineup()
    
    roles.forEach((role) => {
        let chosenCoroinhas = GetRolePrioritizedCoroinhas(maxPriority,role)

        let coroinha:Coroinha = GetRandom(chosenCoroinhas)
        coroinha.rodizio[role] = 4

        ReduceAllFunctionCooldown(coroinha,1)
        newLineup.line.set(role,coroinha)
        newLineup.coroinhas.push(coroinha)
        
        RemoveCoroinha(coroinha,maxPriority)
    })
    
    newLineup.day = day
    newLineup.weekend = weekend

    newLineup.coroinhas.forEach((cor:Coroinha) => {
        cor.priority = 4
        cor.weekendPriority[day] = 4
        cor.lastWeekend = weekend
    });

    // Ajustar prioridades
    if(day != "Outro"){
        ReduceAllDayPriority(newLineup.coroinhas,day,1)
        ReduceAllGeneralPriority(newLineup.coroinhas,1)
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
export function GenerateRandomLineup(roles:string[],weekend:string="Outro",day:string="Outro"):CoroinhaLineup{
    let coroinhas = CoroinhaData.allCoroinhas.slice()
    let availableCoroinhas = []

    availableCoroinhas = RemoveUnvailable(coroinhas,"Outro","Outro")

    let generatedLineup = new CoroinhaLineup()
    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]
        let curCor = GetRandom(availableCoroinhas)

        generatedLineup.line.set(curRole,curCor)
        generatedLineup.coroinhas.push(curCor)
        availableCoroinhas.splice(availableCoroinhas.indexOf(curCor),1)
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend
    return generatedLineup
}

/**
 * Remove os coroinhas que não estão disponíveis no dia e fim de semana ou que estão fora da escala.
 * @param {Array<Coroinha>} coroinhas lista de coroinhas @param {string} day dia @param {string} weekend fim de semana 
 */
function RemoveUnvailable(coroinhas:Array<Coroinha>,day:string,weekend:string){
    let availableCoroinhas = []

    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]

        if(curCoroinha.onLineup){
            if(day != "Outro" && weekend != "Outro"){
                if(curCoroinha.disp[weekend][day]){
                    availableCoroinhas.push(curCoroinha)
                }
            }
            else{
                availableCoroinhas.push(curCoroinha)
            }
            
        }
    }
    return availableCoroinhas
}

/** Retorna uma lista sem os coroinhas que já foram escalados nesse fim de semana.
 * Caso a lista seja menor do que a quantidade necessária de coroinhas, os coroinhas
 * removidos serão readicionados à lista de disponíveis, levando em conta prioridade geral,
 * até que ela atinja a quantidade mínima.
 * Com o parâmetro de aleatoriedade Aleatoriedade for verdadeiro, escolherá coroinhas aleatórios que foram removidos. Quando falso, escolherá os coroinhas com maior prioridade que foram removidos
 * 
 * @param coroinhas Lista de coroinhas
 * @param weekend Final de semana
 * @param min Mínimo de coroinhas necessários
 * @param randomness Aleatoriedade
 * @returns Lista com os coroinhas disponíveis
 */
function RemoveIfAlreadyOnWeekend(coroinhas:Array<Coroinha>,weekend:string,min:number,randomness:boolean = true){
    let removed:Array<Coroinha> = []
    let available:Array<Coroinha> = []
    
    coroinhas.forEach((coroinha) =>{
        if(coroinha.lastWeekend == weekend){
            console.log(coroinha.nick, " is on this weekend!!!!")
            console.log(coroinha.lastWeekend,"/",weekend)
            removed.push(coroinha)
        }
        else{
            console.log(coroinha.nick," not on this weekend. Available!")
            available.push(coroinha)
        }
    })

    let i = 0
    while(available.length < min && i < removed.length){ 
        let coroinha = null
        if(randomness){
            coroinha = GetRandom(removed)
        }
        else{
            coroinha = GetRandom(GetPrioritizedCoroinhas(removed))
        }
        available.push(coroinha)
        RemoveCoroinha(coroinha,removed)
        i++
    }

    return available
}

/**
 * Separa os coroinhas dentro do mapa de prioridade geral.
 * @param priorityMap Mapa com as prioridades
 * @param coroinhas Todos os coroinhas
 */
function OrganizeByPriority(priorityMap:Map<string,Array<Coroinha>>,coroinhas:Array<Coroinha>){
    
    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]
        
        if(curCoroinha.priority < 0){
            let map = priorityMap.get("very-high-priority")
            if(map != undefined){
                map!.push(curCoroinha)
            }
            else{
                priorityMap.set("very-high-priority",[curCoroinha])
            }
        }
        if(curCoroinha.priority >= 0 && curCoroinha.priority <= 3){
            let map = priorityMap.get("high-priority")
            if(map != undefined){
                map!.push(curCoroinha)
            }
            else{
                priorityMap.set("high-priority",[curCoroinha])
            }
        }

        else if(curCoroinha.priority > 3){
            let map = priorityMap.get("low-priority")
            if(map != undefined){
                map!.push(curCoroinha)
            }
            else{
                priorityMap.set("low-priority",[curCoroinha])
            }
            
        }
    }
}

/** Organiza o mapa de prioridades da maior para a menor prioridade.
 * 
 * @param priorityMap Mapa de prioridades
 */
function SortPriorityMap(priorityMap:Map<string,Array<Coroinha>>){
    let sorted:Map<string,Array<Coroinha>> = new Map<string,Array<Coroinha>>()
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
 * @param coroinhas Todos os coroinhas
 * @param day Dia da escala
 */
function OrganizeByDayPriority(priorityMap:Map<string,Array<Coroinha>>,coroinhas:Array<Coroinha>,day:string){
    coroinhas.forEach((coroinha) =>{
        let priority:number = coroinha.weekendPriority[day]
        if(priority < 0){
            let map:Array<Coroinha>|undefined = priorityMap.get("very-high-priority")
            if(map == undefined){
                priorityMap.set("very-high-priority",[coroinha])
            }
            else{
                map.push(coroinha)
            }
        }
        if(priority >= 0 && priority <= 2){
            let map:Array<Coroinha>|undefined = priorityMap.get("high-priority")
            if(map == undefined){
                priorityMap.set("high-priority",[coroinha])
            }
            else{
                map.push(coroinha)
            }
        }
        if(priority > 2){
            let map:Array<Coroinha>|undefined = priorityMap.get("low-priority")
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

function PrioritizedCoroinhas(genPriority:Map<any,any>,dayPriority:Map<any,any>,amount:number){
    let dayKeys = Array.from(dayPriority.keys())
    let priorities = Array.from(genPriority.keys())

    let prioritized:Array<Coroinha> = [] // Coroinhas com prioridade máxima
    let curGenPrio = 0 // Prioridade geral sendo checada
    let curDayPrio = 0 // Prioridade diária sendo checada

    while(prioritized.length < amount){ // Enquanto não houver a quantidade desejada de coroinhas escolhidos:
        let genArray = genPriority.get(priorities[curGenPrio]) // Lista atual da prioridade geral
        let dayArray = dayPriority.get(dayKeys[curDayPrio]) // Lista atual da prioridade diária

        for(let i = 0; i < genArray.length;i++){
            let genCoroinha = genArray[i]
            
            for(let j = 0; j < dayArray.length; j++){
                let dayCoroinha = dayArray[j]
                if(genCoroinha == dayCoroinha){ // Se encontrou iguais, é porque têm a maior prioridade possível nas duas listas
                    prioritized.push(genCoroinha)
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
                    console.error("Not enough coroinhas for full lineup!")
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
function GeneralPrioritizedCoroinhas(genPriority:Map<any,any>,amount:number){
    let prioritized:Array<Coroinha> = []
    let curGenPrio = 0
    let genKeys = Array.from(genPriority.keys())
    while(prioritized.length < amount){
        let genArray = genPriority.get(genKeys[curGenPrio])
        
        genArray.array.forEach((coroinha:Coroinha) => {
            prioritized.push(coroinha)
        });
    }

    return prioritized
}

/** Retorna uma lista com os coroinhas que possuem a maior prioridade por função.
 * 
 * @param coroinhas Lista de coroinhas
 * @param role Função
 * @returns Lista com os coroinhas com maior prioridade na função
 */
function GetRolePrioritizedCoroinhas(coroinhas:Array<Coroinha>,role:string){
    let prioritized:Array<Coroinha> = []
    let smallest:number = coroinhas[0].rodizio[role]

    coroinhas.forEach((coroinha) => {
        let prio = coroinha.rodizio[role]
        if(prio < smallest){
            smallest = prio
        }
    })

    coroinhas.forEach((coroinha)=>{
        if(coroinha.rodizio[role] == smallest){
            prioritized.push(coroinha)
        }
    })

    return prioritized
}

/** Reduz as prioridades de função de um coroinha por um determinado peso.
 * 
 * @param cor Coroinha
 * @param weight Peso
 */
function ReduceAllFunctionCooldown(cor:Coroinha,weight:number){
    cor.rodizio["donsD"]-=weight
    cor.rodizio["donsE"]-=weight
    cor.rodizio["cestD"]-=weight
    cor.rodizio["cestE"]-=weight
}
/** Reduz a prioridade geral de todos os coroinhas, salvo exceções, por determinado peso
 * 
 * @param exceptions Exceções
 * @param weight Peso
 */
function ReduceAllGeneralPriority(exceptions:Array<Coroinha>,weight:number){
    for(let i =0; i < CoroinhaData.allCoroinhas.length;i++){
        let curCoroinha = CoroinhaData.allCoroinhas[i]

        if(!HasCoroinha(curCoroinha,exceptions)){
            curCoroinha.priority = curCoroinha.priority-1
        }
    }
}

/**
 * Reduz a prioridade diária de todos os coroinhas por determinado peso, salvo excessões.
 * @param exceptions Excessões
 * @param day Dia
 * @param weight Peso
 */
function ReduceAllDayPriority(exceptions:Array<Coroinha>,day:string,weight:number){
    for(let i =0; i < CoroinhaData.allCoroinhas.length;i++){
        let curCoroinha = CoroinhaData.allCoroinhas[i]

        if(!HasCoroinha(curCoroinha,exceptions)){
            curCoroinha.weekendPriority[day]-=weight
        }
    }
}

/** Verifica se na lista há ou não um determinado coroinha
 * 
 * @param cor Coroinha a procurar
 * @param array Lista de coroinhas
 * @returns Coroinha está na lista
 */
function HasCoroinha(cor:Coroinha,array:Array<Coroinha>): Boolean{
    for(let i = 0; i < array.length;i++){
        if(array[i] == cor){
            return true
        }
    }

    return false
}

/** Retorna uma lista com os coroinhas com maior prioridade geral.
 * 
 * @param coroinhas Lista de coroinhas
 * @returns Coroinhas priorizados
 */
function GetPrioritizedCoroinhas(coroinhas:Array<Coroinha>){
    let prioritized:Array<Coroinha> = []
    let smallest:number = coroinhas[0].priority

    coroinhas.forEach((coroinha) => {
        let prio = coroinha.priority
        if(prio < smallest){
            smallest = prio
        }
    })

    coroinhas.forEach((coroinha)=>{
        if(coroinha.priority == smallest){
            prioritized.push(coroinha)
        }
    })

    return prioritized
}