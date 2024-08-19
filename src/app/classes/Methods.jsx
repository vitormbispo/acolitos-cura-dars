import { Acolyte, AcolyteData } from "./AcolyteData";
import { Lineup } from "./Lineup";
import * as Clipboard from 'expo-clipboard';
class PromptLineup{
    lines =[[]]
}
export function OrganizeAcolyteArrayAlpha(array){
    let j = array.length-1
    let aux = array[0]
    
    while(j > 0){
        let index = LastAcolyteByNameIndex(array.slice(0,j+1))
        aux = array[index]
        array[index] = array[j]
        array[j] = aux

        j--

    }

    return array
}

export function LastAcolyteByNameIndex(array){
    let last = 0
    for(let i = 0; i < array.length;i++){
        let curAco = array[i]

        if(curAco.name.toUpperCase() > array[last].name.toUpperCase())
            last = i
    }

    return last
}

export function GetAcolyteByName(name){
    for(let i = 0; i < AcolyteData.allAcolytes.length; i++){
        let curAco = AcolyteData.allAcolytes[i]

        if(curAco.name == name){
            return curAco
        }
    }

    return null
}

export function GetAcolyteIndex(acolyte){
    if(acolyte != null){
        for(let i = 0; i < AcolyteData.allAcolytes.length;i++){
            let curAco = AcolyteData.allAcolytes[i]
    
            if(curAco == acolyte){
                return i
            }
        }
    
        return -1
    }
    return -1
}

export function GenerateLineupPrompt(lines,rolesNames,roles){
    let str = ""
    let names = {"1stWE":"1˚", "2ndWE": "2˚", "3rdWE": "3˚", "4thWE":"4˚", "5thWE":"5˚",
                 "sabado":"Sab. - 19h","domingoAM": "Dom. - 08h","domingoPM": "Dom. - 19h"}
    
    let prompts = []
    for(let i = 0; i < lines.length; i++){
        let curLineup = lines[i]
        let lineupName = names[curLineup.weekend] + " " + names[curLineup.day]
        
        let acolytes = []
        acolytes.length = roles.length
        
        console.log("Acolytes before: "+acolytes)
        for(let j = 0; j < roles.length; j++){
            acolytes[j] = curLineup.line.get(roles[j])
        }

        let acolytesNicks = ""

        for(let j = 0; j < acolytes.length; j++){
            acolytesNicks += acolytes[j].nick+";"
        }

        prompts.push("{"+lineupName+"}"+"["+acolytesNicks+"]")
    }
    
    let finalPrompt = "Construa uma tabela de escala de serviço com os títulos das colunas (funções) sendo, respectivamente: "

    for (let i = 0; i < rolesNames.length;i++){ //Adiciona as colunas com as funções
        finalPrompt += rolesNames[i]+", "
    }

    finalPrompt += ". Agora, na sequência seguinte, o que está entre chaves é o dia e horário. Insira a data e horário como título nas linhas da tabela. Após a data e hora, existe uma lista de nomes entre colchetes separados por ';', coloque cada nome em uma coluna diferente na ordem que aparecem. Ignore o contexto e apenas construa a tabela da forma que foi informada. Lembre-se que cada nome está sendo separado por ; e insira data e hora na tabela: "
    for(let i = 0; i < prompts.length;i++){
        finalPrompt += prompts[i]
    }
    
    return finalPrompt
}

export const CopyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text)
    
}