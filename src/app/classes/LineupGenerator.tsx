import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Acolyte, AcolyteData } from "./AcolyteData";
import { Lineup } from "./Lineup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleLineupScreen } from "../screens/SingleLineup";


export function GenerateLineup(weekend:any=null,day:any=null,roles:string[]){
    interface RolesDict{
    [key:string]:any
}

    console.log("GENERATINNNGGGG")
    console.log(" THE ACOLYTES ")
    console.log(AcolyteData.allAcolytes)
    //const roles:string[] = ["cero1","cero2","turib","navet","libri","cruci"]
    const chosen:Map<string,any> = new Map<string,any>()
    let acolytes = AcolyteData.allAcolytes.slice()
    let allChosenAcolytes:Array<Acolyte> = new Array<Acolyte>()

    console.log("Acolytessssssd:")
    console.log(acolytes)

    for(let i = 0; i < roles.length; i++){
        chosen.set(roles[i],null)
    }

    console.log("CHOSEN")
    console.log(chosen)
    console.log("Weekend: "+weekend)
    console.log("Day: "+day)
    // Remover acólitos não escaláveis
    let acolytesToRemove = acolytes.slice()

    for(let i = 0; i < acolytes.length;i++){
        let curAcolyte = acolytes[i]

        console.log("Checking availability of: "+curAcolyte.nick)

        if(!curAcolyte.onLineup){
            acolytesToRemove.splice(i,1)
            console.log("Acolyte out of lineup, removing it.")
        }

        if(day != "Outro" && weekend != "Outro"){
            
            console.log("Filtering for day")
            console.log("Weekend: "+weekend+" / "+curAcolyte.disp[weekend])

            if(!curAcolyte.disp[weekend][day]){
                console.log("Acolyte \""+curAcolyte.nick+"\" not available for this lineup, removing it!")
                acolytesToRemove.splice(i,1)
                
            }
        }

        acolytes = acolytesToRemove
    }
    
    console.log("Generating new lineup!")

    // Prioridade geral
    let generalPriority = new Map()
    let generalPriorities = ["high-priority","medium-priority","low-priority"]
    
    generalPriority.set("high-priority",new Array<Acolyte>())
    generalPriority.set("medium-priority",new Array<Acolyte>())
    generalPriority.set("low-priority",new Array<Acolyte>())

    for(let i = 0; i < acolytes.length;i++){
        let curAcolyte = acolytes[i]
        
        console.log("Checking priority of acolyte: "+curAcolyte.nick)
        console.log("Priority: "+curAcolyte.priority)

        if(curAcolyte.priority <= 1){
            generalPriority.get("high-priority").push(curAcolyte)
            console.log("Added to high priority!")
        }
        else if(curAcolyte.priority >= 2){
            generalPriority.get("medium-priority").push(curAcolyte)
            console.log("Added to medium priority!")
        }
    }

    let chosenAcolytes = []
    let priorityNum = 0


    // Pegar a quantidade máxima de acólitos com maior prioridade geral
    let priorityAcolytes:Array<Acolyte> = []
    let prioritySortingFinished = false
    let dayPriorityNum = 0
    

    priorityNum = 0
    while(!prioritySortingFinished){
        let priorityArray = generalPriority.get(generalPriorities[priorityNum])
        
        if(priorityArray != undefined){
            for(let i = 0; i < priorityArray.length;i++){
                priorityAcolytes.push(priorityArray[i])
            }
    
            if(priorityAcolytes.length < roles.length){
                priorityNum++
                continue   
            }
            else{
                prioritySortingFinished = true
            }
        }
        
        else{
            //console.log("Not enough acolytes!")
            break
        }
    }

    console.log("Most priorited acolytes: ")
    console.log(priorityAcolytes)
    
    
   

    
    // SEM BASE NO DIA
        priorityNum = 0
        // Escolhendo acólitos com maior prioridade sem base no dia
        while(chosenAcolytes.length < roles.length){
            
    
            let curPriority:Array<Acolyte> = generalPriority.get(generalPriorities[priorityNum])
            
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
            
            let chsn = curPriority[randomNumber(0,curPriority.length-1)] // Acólito aleatório na prioridade atual escolhido
            console.log("Chosen acolyte with priority "+generalPriorities[priorityNum]+": "+chsn.nick)
    
            chosenAcolytes.push(chsn) // Passando para a array dos escolhidos
            curPriority.splice(curPriority.indexOf(chsn),1) // Removendo da array de prioridade
    
            if(curPriority.length<=0){ // Se acabar os acólitos na prioridade atual, passa pra próxima
                if(generalPriority.get(generalPriorities[priorityNum+1]) != undefined){
                    if(generalPriority.get(generalPriorities[priorityNum+1]).length>0){
                        priorityNum++
                    }
                    else{
                        //console.error("Not enough acolytes for full lineup!")
                        break
                    }
                }
                else{
                    //console.error("Not enough acolytes for full lineup!")
                    break
                }
                
                
            }
        }
        console.log("The chosen acolytes are: ")
        console.log(chosenAcolytes)
        

    
    

    //Separação por função
    for(let i = 0; i < roles.length;i++){
        let rolePriority = new Map() // Mapa que liga classifica acólitos de acordo com sua prioridade
        let priorities:any[] = []   // Prioridades encontradas
        let organizedPriorities:any[] = [] // Prioridades em ordem
        let key = roles[i] // Função atual

        console.log("Filtering acolytes by priority on role: "+roles[i]+". Process: "+i+"/"+(roles.length-1))
       
        //Separar acólitos por prioridade
        for(let h = 0;h < chosenAcolytes.length;h++){
            let curAcolyte = chosenAcolytes[h]
            let priority = curAcolyte.rodizio[key]
            
            console.log("Separating acolyte: "+curAcolyte.name+" with priority "+priority)
            console.log("Priorities size: ",priorities.length)
            
            if(priorities.length == 0){
                console.log("Separated: "+curAcolyte.name)
                priorities.push(priority) // Cria nova prioridade
                rolePriority.set(priority,new Array<Acolyte>()) // Cria nova chave de prioridade
                rolePriority.get(priority).push(curAcolyte)  // Adiciona o acólito a ela
                console.log("Priorities: ")
                console.log(priorities)
                continue
            }
            
            for(let z = 0; z < priorities.length;z++){
                console.log("Priority: "+z)

                if(priority == priorities[z]){
                    rolePriority.get(priority).push(curAcolyte)
                    break
                }
                else if(z>=priorities.length-1){
                    console.log("Separated: "+curAcolyte.name)
                    priorities.push(priority) // Cria nova prioridade
                    rolePriority.set(priority,new Array<Acolyte>()) // Cria nova chave de prioridade
                    rolePriority.get(priority).push(curAcolyte)  // Adiciona o acólito a ela
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

        let priorityAcolytes = rolePriority.get(organizedPriorities[0]) // Acólitos com maior prioridade (Array<Acolyte>)
        console.log("Acolytes with priority: ")
        console.log(priorityAcolytes)


        let chosenIndex = randomNumber(0,priorityAcolytes.length-1)
        console.log("Chosen index: "+chosenIndex)

        let chosenForFunction:Acolyte = priorityAcolytes[chosenIndex]
        chosen.set(key,chosenForFunction)
        
        console.log("Chosen acolyte for function \""+key+ "\": "+chosen.get(key).nick)
        chosenAcolytes.splice(chosenAcolytes.indexOf(chosen.get(key)),1)

        allChosenAcolytes.push(chosenForFunction)
        
        let acolyteOnList = AcolyteData.allAcolytes[AcolyteData.allAcolytes.indexOf(chosenForFunction)]
        
        acolyteOnList.oldRodizio = JSON.parse(JSON.stringify(acolyteOnList.rodizio))
        acolyteOnList.oldPriority = JSON.parse(JSON.stringify(acolyteOnList.priority))
        acolyteOnList.oldWeekendPriority = JSON.parse(JSON.stringify(acolyteOnList.weekendPriority))
        
        // Definir Rodizio
        acolyteOnList.rodizio[key] = 6
        acolyteOnList.priority = 4
        
        if(day!="Outro"){
            acolyteOnList.weekendPriority[day] = 3
        }
        
        ReduceAllFunctionCooldown(AcolyteData.allAcolytes[AcolyteData.allAcolytes.indexOf(chosenForFunction)],1)

        AsyncStorage.setItem("AcolyteData",JSON.stringify(AcolyteData.allAcolytes))
        
        if(chosenAcolytes.length<=0 && i < roles.length){
            //console.error("Not enogh acolytes for full lineup!")
            break
        }
    } 

    console.log("!!!---LINEUP FINISHED---!!!")
    console.log(chosen)

    let generatedLineup = new Lineup()


    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]

        generatedLineup.line.set(curRole,chosen.get(curRole))
        generatedLineup.acolytes.push(chosen.get(curRole))
        
    }

    generatedLineup.day = day
    generatedLineup.weekend = weekend

    console.log(generatedLineup.acolytes)
    console.log("Lineup: ")
    console.log(generatedLineup.line)

    ReduceAllGeneralPriority(allChosenAcolytes,1)
    ReduceAllDayPriority(allChosenAcolytes,day,1)

    console.log("Completely terminated.")
    return generatedLineup
    
}

export function GenerateRandomLineup(roles:string[],weekend="Outro",day="Outro"):Lineup{
    interface RolesDict{
        [key:string]:any
    }
    console.log("GENERATING RANDOM LINEUP")
    //const roles:string[] = ["cero1","cero2","turib","navet","libri","cruci"]
    const chosen:RolesDict = {"cero1":null,"cero2":null,"turib":null,"navet":null,"libri":null,"cruci":null}
    let acolytes = AcolyteData.allAcolytes.slice()
    let allChosenAcolytes:Array<Acolyte> = new Array<Acolyte>()
    let acolytesToRemove = acolytes.slice()

    for(let i = 0; i < acolytes.length;i++){
        let curAcolyte = acolytes[i]

        console.log("Checking availability of: "+curAcolyte.nick)

        if(!curAcolyte.onLineup){
            acolytesToRemove.splice(i,1)
            console.log("Acolyte out of lineup, removing it.")
        }
    }

    let availableAcolytes = acolytes.slice()
    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]
        let chosenIndex = randomNumber(0,availableAcolytes.length-1)
        let curAco = availableAcolytes[chosenIndex]

        chosen[curRole] = curAco
        availableAcolytes.splice(availableAcolytes.indexOf(curAco),1)
    }

    let generatedLineup = new Lineup()

    for(let i = 0; i < roles.length;i++){
        let curRole = roles[i]

        generatedLineup.line.set(curRole,chosen[curRole])
        generatedLineup.acolytes.push(chosen[curRole])
    }
    
    generatedLineup.day = day
    generatedLineup.weekend = weekend

    
    return generatedLineup
}
function randomNumber(min:any, max:any) {
    return Math.floor(Math.random() * (max - min) + min);
}

function ReduceAllFunctionCooldown(aco:Acolyte,weight:number){
    aco.rodizio["cero1"]-=weight
    aco.rodizio["cero2"]-=weight
    aco.rodizio["cruci"]-=weight
    aco.rodizio["turib"]-=weight
    aco.rodizio["navet"]-=weight
    aco.rodizio["libri"]-=weight

    aco.priority-=weight
}

function ReduceAllGeneralPriority(exceptions:Array<Acolyte>,weight:number){
    for(let i =0; i < AcolyteData.allAcolytes.length;i++){
        let curAcolyte = AcolyteData.allAcolytes[i]

        if(!HasAcolyte(curAcolyte,exceptions)){
            curAcolyte.priority-=weight
        }
    }
}

function ReduceAllDayPriority(exceptions:Array<Acolyte>,day:string,weight:number){
    for(let i =0; i < AcolyteData.allAcolytes.length;i++){
        let curAcolyte = AcolyteData.allAcolytes[i]

        if(!HasAcolyte(curAcolyte,exceptions)){
            curAcolyte.weekendPriority[day]-=weight
        }
    }
}

function HasAcolyte(aco:Acolyte,array:Array<Acolyte>): Boolean{
    for(let i = 0; i < array.length;i++){
        if(array[i] == aco){
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