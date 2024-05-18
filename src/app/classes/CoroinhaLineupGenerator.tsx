import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Acolyte, AcolyteData } from "./AcolyteData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleLineupScreen } from "../screens/SingleLineup";
import { Coroinha, CoroinhaData } from "./CoroinhaData";
import { CoroinhaLineup } from "./CoroinhaLineup";


export function GenerateLineup(weekend:any=null,day:any=null,roles:string[]){
    interface RolesDict{
    [key:string]:any
}


    //const roles:string[] = ["donsD","donsE","cestD","cestE"]
    const chosen:Map<string,any> = new Map<string,any>()
    let coroinhas = CoroinhaData.allCoroinhas.slice()
    let allChosenCoroinhas:Array<Coroinha> = new Array<Coroinha>()

    for(let i = 0; i < roles.length; i++){
        chosen.set(roles[i],null)
    }

    console.log("Weekend: "+weekend)
    console.log("Day: "+day)
    // Remover coroinhas não escaláveis
    let coroinhasToRemove = coroinhas.slice()

    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]

        console.log("Checking availability of: "+curCoroinha.nick)

        if(!curCoroinha.onLineup){
            coroinhasToRemove.splice(i,1)
            console.log("Coroinha out of lineup, removing it.")
        }

        if(day != "Outro" && weekend != "Outro"){
            
            console.log("Filtering for day")
            console.log("Weekend: "+weekend+" / "+curCoroinha.disp[weekend])

            if(!curCoroinha.disp[weekend][day]){
                console.log("Coroinha \""+curCoroinha.nick+"\" not available for this lineup, removing it!")
                coroinhasToRemove.splice(i,1)
                
            }
        }

        coroinhas = coroinhasToRemove
    }
    
    console.log("Generating new lineup!")

    // Prioridade geral
    let generalPriority = new Map()
    let generalPriorities = ["high-priority","medium-priority","low-priority"]
    
    generalPriority.set("high-priority",new Array<Coroinha>())
    generalPriority.set("medium-priority",new Array<Coroinha>())
    generalPriority.set("low-priority",new Array<Coroinha>())

    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]
        
        console.log("Checking priority of coroinha: "+curCoroinha.nick)
        console.log("Priority: "+curCoroinha.priority)

        if(curCoroinha.priority <= 1){
            generalPriority.get("high-priority").push(curCoroinha)
            console.log("Added to high priority!")
        }
        else if(curCoroinha.priority <= 2){
            generalPriority.get("medium-priority").push(curCoroinha)
            console.log("Added to medium priority!")
        }
        else if(curCoroinha.priority > 2){
            generalPriority.get("low-priority").push(curCoroinha)
            console.log("Added to low priority!")
        }
    }

    let chosenCoroinhas = []
    let priorityNum = 0

    // Prioridade por horário
    let dayPriority = new Map()
    let dayPriorities = []

    

    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]
        let curPriority = curCoroinha.weekendPriority[day]
        
        console.log("Checking day priority of coroinha: "+curCoroinha.nick)
        console.log("Day priority: "+curPriority)

        // Colocar no mapa
        if(dayPriority.get(curPriority) == undefined){
            dayPriority.set(curPriority, new Array<Coroinha>())
            dayPriority.get(curPriority).push(curCoroinha)
        }
        else{
            dayPriority.get(curPriority).push(curCoroinha)
        }

        if(dayPriorities.length==0){
            dayPriorities.push(curPriority)
        }
        else{
            for(let j = 0; j < dayPriorities.length; j++){
                if(dayPriorities[j] == curPriority){
                    break
                }
                
                if(j == dayPriorities.length-1){
                    dayPriorities.push(curPriority)
                }
                
            }
        }

    }

    console.log("Day priorities: ")
    console.log(dayPriority)

    let organizedDayPriorities = SortArrayByNumber(dayPriorities)

    // Pegar a quantidade máxima de coroinhas com maior prioridade geral
    let priorityCoroinhas:Array<Coroinha> = []
    let prioritySortingFinished = false
    let dayPriorityNum = 0
    

    priorityNum = 0
    while(!prioritySortingFinished){
        let priorityArray = generalPriority.get(generalPriorities[priorityNum])
        
        if(priorityArray != undefined){
            for(let i = 0; i < priorityArray.length;i++){
                priorityCoroinhas.push(priorityArray[i])
            }
    
            if(priorityCoroinhas.length < roles.length){
                priorityNum++
                continue   
            }
            else{
                prioritySortingFinished = true
            }
        }
        
        else{
            console.log("Not enough coroinhas!")
            break
        }
    }

    //console.log("Most priorited coroinhas: ")
    //console.log(priorityCoroinhas)
    
    // Se tiver separando por dia, escolher os coroinhas com maior prioridade
    prioritySortingFinished = false
    let maxPriorityCoroinhas:Array<Coroinha> = new Array<Coroinha>()

    while(!prioritySortingFinished){
        let dayPriorityArray = dayPriority.get(organizedDayPriorities[dayPriorityNum])
        
        if(dayPriorityArray!=undefined){
            for(let i = 0; i < priorityCoroinhas.length;i++){
                for(let j = 0; j < dayPriorityArray.length;j++){
    
                    let priorityCoroinha = priorityCoroinhas[i]
                    let dayPriorityCoroinha = dayPriorityArray[j]
    
                    console.log("i = "+i+" j = "+j)
                    console.log("Comparing coroinha by priority: "+priorityCoroinha.nick+ " with coroinha by day priority: "+dayPriorityCoroinha.nick)
                    
                    if(priorityCoroinha == dayPriorityCoroinha){
                        console.log("They are the same! Adding to full priority")
                        maxPriorityCoroinhas.push(priorityCoroinha)
                        break
                    }
                }
            }
    
            if(maxPriorityCoroinhas.length<roles.length){
                dayPriorityNum++
                continue
            }
            else{
                prioritySortingFinished = true
            }
        }
        else{
            console.log("Not enough coroinhas for max priority!")
            break
        }
        
    }
    
    // SEM BASE NO DIA
    if(day=="Outro"){
        priorityNum = 0
        // Escolhendo coroinhas com maior prioridade sem base no dia
        while(chosenCoroinhas.length < roles.length){
            
    
            let curPriority:Array<Coroinha> = generalPriority.get(generalPriorities[priorityNum])
            
            if(curPriority == undefined){
                console.error("Any priority category found!")
                break
            }
            if(curPriority.length<=0){
                priorityNum++
                continue
            }
    
            console.log("Checking priority: "+generalPriorities[priorityNum])
            console.log("The priority array is: ")
            console.log(curPriority)
            
            let chsn = curPriority[randomNumber(0,curPriority.length-1)] // Coroinha aleatório na prioridade atual escolhido
            console.log("Chosen coroinha with priority "+generalPriorities[priorityNum]+": "+chsn.nick)
    
            chosenCoroinhas.push(chsn) // Passando para a array dos escolhidos
            curPriority.splice(curPriority.indexOf(chsn),1) // Removendo da array de prioridade
    
            if(curPriority.length<=0){ // Se acabar os coroinhas na prioridade atual, passa pra próxima
                if(generalPriority.get(generalPriorities[priorityNum+1]) != undefined){
                    if(generalPriority.get(generalPriorities[priorityNum+1]).length>0){
                        priorityNum++
                    }
                    else{
                        console.error("Not enough coroinhas for full lineup!")
                        break
                    }
                }
                else{
                    console.error("Not enough coroinhas for full lineup!")
                    break
                }
                
                
            }
        }
        //console.log("The chosen coroinhas are: ")
        //console.log(chosenCoroinhas)
        
    }


    // COM BASE NO DIA
    else{
        //console.log("Coroinhas with max priority: ")
        //console.log(maxPriorityCoroinhas)
        //console.log("First element: ")
        //console.log(maxPriorityCoroinhas[0])

        while(chosenCoroinhas.length < roles.length){
            
            if(maxPriorityCoroinhas.length<=0){
                console.log("Not enough coroinhas! breaking")
                break    
            }

            let chosenNumber = randomNumber(0,maxPriorityCoroinhas.length-1)
            let cur = maxPriorityCoroinhas[chosenNumber]
            console.log("Coroinha chosen! "+ cur)
            
            chosenCoroinhas.push(cur)
            maxPriorityCoroinhas.splice(maxPriorityCoroinhas.indexOf(cur),1)           
        }

        //console.log("Chosen coroinhas: ")
        //console.log(chosenCoroinhas)
    }
    
    //Separação por função
    for(let i = 0; i < roles.length;i++){
        let rolePriority = new Map() // Mapa que liga classifica coroinhas de acordo com sua prioridade
        let priorities:any[] = []   // Prioridades encontradas
        let organizedPriorities:any[] = [] // Prioridades em ordem
        let key = roles[i] // Função atual

        console.log("Filtering coroinhas by priority on role: "+roles[i]+". Process: "+i+"/"+(roles.length-1))
       
        //Separar coroinhas por prioridade
        for(let h = 0;h < chosenCoroinhas.length;h++){
            let curCoroinha = chosenCoroinhas[h]
            let priority = curCoroinha.rodizio[key]
            
            console.log("Separating coroinhas: "+curCoroinha.name+" with priority "+priority)
            console.log("Priorities size: ",priorities.length)
            
            if(priorities.length == 0){
                console.log("Separated: "+curCoroinha.name)
                priorities.push(priority) // Cria nova prioridade
                rolePriority.set(priority,new Array<Coroinha>()) // Cria nova chave de prioridade
                rolePriority.get(priority).push(curCoroinha)  // Adiciona o coroinha a ela
                console.log("Priorities: ")
                console.log(priorities)
                continue
            }
            
            for(let z = 0; z < priorities.length;z++){
                console.log("Priority: "+z)

                if(priority == priorities[z]){
                    rolePriority.get(priority).push(curCoroinha)
                    break
                }
                else if(z>=priorities.length-1){
                    console.log("Separated: "+curCoroinha.name)
                    priorities.push(priority) // Cria nova prioridade
                    rolePriority.set(priority,new Array<Coroinha>()) // Cria nova chave de prioridade
                    rolePriority.get(priority).push(curCoroinha)  // Adiciona o coroinha a ela
                    console.log("Priorities: ")
                    console.log(priorities)
                    break
                }
            }
            
            
            
        }

        
        console.log("Role priority: ")
        console.log(rolePriority)

        //Organizar prioridades por ordem numérica
        
        organizedPriorities = SortArrayByNumber(priorities)

        console.log("Priorities organized! ")
        console.log(organizedPriorities)

        let priorityCoroinhas = rolePriority.get(organizedPriorities[0]) // Coroinhas com maior prioridade (Array<Coroinha>)
        console.log("Coroinhas with priority: ")
        console.log(priorityCoroinhas)


        let chosenIndex = randomNumber(0,priorityCoroinhas.length-1)
        console.log("Chosen index: "+chosenIndex)

        let chosenForFunction:Coroinha = priorityCoroinhas[chosenIndex]
        chosen.set(key,chosenForFunction)
        
        console.log("Chosen coroinha for function \""+key+ "\": "+chosen.get(key).nick)
        chosenCoroinhas.splice(chosenCoroinhas.indexOf(chosen.get(key)),1)

        allChosenCoroinhas.push(chosenForFunction)
        
        let coroinhaOnList = CoroinhaData.allCoroinhas[CoroinhaData.allCoroinhas.indexOf(chosenForFunction)]
        
        // Definir Rodizio

        coroinhaOnList.oldRodizio = JSON.parse(JSON.stringify(coroinhaOnList.rodizio))
        coroinhaOnList.oldPriority = JSON.parse(JSON.stringify(coroinhaOnList.priority))
        coroinhaOnList.oldWeekendPriority = JSON.parse(JSON.stringify(coroinhaOnList.weekendPriority))

        coroinhaOnList.rodizio[key] = 4
        coroinhaOnList.priority = 4

        
        if(day!="Outro"){
            coroinhaOnList.weekendPriority[day] = 3
        }
        
        ReduceAllFunctionCooldown(CoroinhaData.allCoroinhas[CoroinhaData.allCoroinhas.indexOf(chosenForFunction)],1)

        AsyncStorage.setItem("CoroinhaData",JSON.stringify(CoroinhaData.allCoroinhas))
        
        if(allChosenCoroinhas.length<=0 && i < roles.length){
            console.error("Not enogh coroinhas for full lineup!")
            console.log("lenght: "+chosenCoroinhas.length)
            break
        }
    } 

    console.log("!!!---LINEUP FINISHED---!!!")
    console.log(chosen)

    let generatedLineup = new CoroinhaLineup()

    console.log("Lineup created")
    generatedLineup.coroinhas = []
    
    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]
        console.log("Current role: "+curRole)

        generatedLineup.line.set(curRole,chosen.get(curRole))
        generatedLineup.coroinhas.push(chosen.get(curRole))
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend

    ReduceAllGeneralPriority(allChosenCoroinhas,1)
    ReduceAllDayPriority(allChosenCoroinhas,day,1)
    return generatedLineup
    
}

export function GenerateRandomLineup(roles:string[]):CoroinhaLineup{
    interface RolesDict{
        [key:string]:any
    }
    console.log("GENERATING RANDOM LINEUP")
    //const roles:string[] = ["donsD","donsE","cestD","cestE"]
    const chosen:RolesDict = {"donsD":null,"donsE":null,"cestD":null,"cestE":null}
    let coroinhas = CoroinhaData.allCoroinhas.slice()
    let allChosenCoroinhas:Array<Coroinha> = new Array<Coroinha>()
    let coroinhasToRemove = coroinhas.slice()

    for(let i = 0; i < coroinhas.length;i++){
        let curCoroinha = coroinhas[i]

        console.log("Checking availability of: "+curCoroinha.nick)

        if(!curCoroinha.onLineup){
            coroinhasToRemove.splice(i,1)
            console.log("Coroinha out of lineup, removing it.")
        }
    }

    let availableCoroinhas = coroinhas.slice()
    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]
        let chosenIndex = randomNumber(0,availableCoroinhas.length-1)
        let curCor = availableCoroinhas[chosenIndex]

        chosen[curRole] = curCor
        availableCoroinhas.splice(availableCoroinhas.indexOf(curCor),1)
    }

    let generatedLineup = new CoroinhaLineup()

    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]

        generatedLineup.line.set(curRole,chosen[curRole])
        generatedLineup.coroinhas.push(chosen[curRole])
    }

    generatedLineup.day = "Outro"
    generatedLineup.weekend = "Outro"
    return generatedLineup
}
function randomNumber(min:any, max:any) {
    return Math.floor(Math.random() * (max - min) + min);
}

function ReduceAllFunctionCooldown(cor:Coroinha,weight:number){
    cor.rodizio["donsD"]-=weight
    cor.rodizio["donsE"]-=weight
    cor.rodizio["cestD"]-=weight
    cor.rodizio["cestE"]-=weight

    cor.priority-=weight
}

function ReduceAllGeneralPriority(exceptions:Array<Coroinha>,weight:number){
    for(let i =0; i < CoroinhaData.allCoroinhas.length;i++){
        let curCoroinha = CoroinhaData.allCoroinhas[i]

        if(!HasCoroinha(curCoroinha,exceptions)){
            curCoroinha.priority-=weight
        }
    }
}

function ReduceAllDayPriority(exceptions:Array<Coroinha>,day:string,weight:number){
    for(let i =0; i < CoroinhaData.allCoroinhas.length;i++){
        let curCoroinha = CoroinhaData.allCoroinhas[i]

        if(!HasCoroinha(curCoroinha,exceptions)){
            curCoroinha.weekendPriority[day]-=weight
        }
    }
}

function HasCoroinha(cor:Coroinha,array:Array<Coroinha>): Boolean{
    for(let i = 0; i < array.length;i++){
        if(array[i] == cor){
            return true
        }
    }

    return false
}

export function SortArrayByNumber(array:Array<number>): Array<number>{
        
        let toOrganize = array.slice()
        let organized = []
        console.log("To organize: ")
        console.log(toOrganize)

        while(organized.length < array.length){
            let smallestNumber = 999
            

            for(let x = 0;x < toOrganize.length;x++){
                console.log("Organizing Item: "+toOrganize[x])
                if(x == 0){
                    console.log("Is first number! Setting as smallest... "+toOrganize[x])
                    smallestNumber = toOrganize[x]
                    continue
                }
                
                if(toOrganize[x] < smallestNumber){
                    console.log("Is smaller! Updating smallest number...")
                    smallestNumber = toOrganize[x]
                }
            }

            console.log("The smallest number is: "+smallestNumber)
            organized.push(smallestNumber)
            toOrganize.splice(toOrganize.indexOf(smallestNumber),1)

            console.log("New to organize: ")
            console.log(toOrganize)
        }

        return(organized)
}