import { Acolyte, AcolyteData } from "./AcolyteData";
import { Lineup } from "./Lineup";
import Clipboard from "expo-clipboard"
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

export function GenerateLineupPrompt(lines){
    let str = ""
    let names = {"1stWE":"1˚", "2ndWE": "2˚", "3rdWE": "3˚", "4thWE":"4˚", "5thWE":"5˚",
                 "sabado":"Sab. - 19h","domingoAM": "Dom. - 08h","domingoPM": "Dom. - 19h"}
    
    let prompts = []
    for(let i = 0; i < lines.length; i++){
        let curLineup = lines[i]
        let lineupName = names[curLineup.weekend] + " " + names[curLineup.day]
        
        let acolytes = ""
        
        for(let j = 0; j < curLineup.acolytes.length;j++){
            acolytes += curLineup.acolytes[j].nick + "; "
        }
        prompts.push("{"+lineupName+"}"+"["+acolytes+"]")
    }
    let roles = ["Ceroferário 1","Ceroferário 2","Librífero","Cruciferário"]
    let finalPrompt = "Construa uma tabela com os títulos das colunas sendo, respectivamente: "

    for (let i = 0; i < roles.length;i++){ //Adiciona as colunas com as funções
        finalPrompt += roles[i]+" "
    }

    finalPrompt += ". Agora, na sequência seguinte, considere que o que está entre chaves é o título de cada linha. Preencha a linha com os nomes dentro do parenteses após o título e entre colchetes, colocando em uma nova coluna cada nome  separado por ponto e vírgula. Ignore o contexto e apenas construa a tabela da forma que foi informada. Lembre-se que cada nome está sendo separado por ; : "
    for(let i = 0; i < prompts.length;i++){
        finalPrompt += prompts[i]
    }
    
    return finalPrompt
}

export const CopyToClipboard = async (text) => {
    let clipboard = new Clipboard()

    clipboard.setString("LoL")
}