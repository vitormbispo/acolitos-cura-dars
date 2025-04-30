import { GenerationOptionsType } from "../screens/LineupGenerationOptions"
import { DateSet } from "./Dates"
import { RoleSet } from "./Roles"
import { SaveData } from "./Methods"
export class PresetsData {
    static acolyteGenerationPresets:Array<Preset> = []
    static coroinhaGenerationPresets:Array<Preset> = []

    /**
     * Retorna uma lista com todas as predefinições (Acólitos + Coroinhas)
     * @returns 
     */
   static GetAllPresets(){
        return  PresetsData.acolyteGenerationPresets.concat(
                PresetsData.coroinhaGenerationPresets)
    }
    
    /**
     * Salva os dados das predefinições no AsyncStorage
     */
    static SavePresets(){
        SaveData("AcolytePresets",this.acolyteGenerationPresets)
        SaveData("CoroinhaPresets",this.coroinhaGenerationPresets)
    }

    /**
     * Verifica a integridade dos dados dos presets
     */
    static VerifyPresetsIntegrity(){
        if(this.acolyteGenerationPresets == null){
            this.acolyteGenerationPresets = []
        }
        if(this.coroinhaGenerationPresets == null){
            this.coroinhaGenerationPresets = []
        }
        this.SavePresets()
    }

    /**
     * Verifica se um nome está disponível para um preset
     * @param name Nome
     * @param presets Lista de presets
     * @returns 
     */
    static IsNameAvailable(name:string,presets:Array<Preset>){
        for(let i = 0; i < presets.length; i++){
            let set = presets[i]
            if(set.name == name){
                return false// Nome igual!
            }
        }
        return true
    }
}

export class Preset {
    /**
     * Nome da predefinição
     */
    name:string
    /**
     * Opções
     */
    options:any

    /**
     * Atualiza as opções e nome dessa predefinição
     */
    UpdatePreset(newOptions:any,newName?:string){
        this.options = CloneGenerationOptions(newOptions)
        newName != undefined ? this.name = newName : null
        PresetsData.SavePresets()
    }
}

function CloneGenerationOptions(source:GenerationOptionsType){
    let newOptions:any = JSON.parse(JSON.stringify(source)) // Cópia superficial. Referências à valores mutáveis ainda são as mesmas da original.

    // Criando novas instâncias dos valores mutáveis:
    let newDateset = new DateSet()
    newDateset.days = source.dateset.days.slice()
    newDateset.weekends = source.dateset.weekends.slice()

    newOptions.dateset = newDateset

    // Criando cópia profunda de todas as configurações exclusivas:
    newOptions.exclusiveOptions = {}
    let exclusiveOptionsKeys = Object.keys(source.exclusiveOptions)
    for(let i = 0; i < exclusiveOptionsKeys.length; i++){
        let option = exclusiveOptionsKeys[i]
        newOptions.exclusiveOptions[option] = CloneExclusiveOptions(source.exclusiveOptions[option])
    }

    newOptions.members = source.members.slice()
    newOptions.randomness = source.randomness
    newOptions.monthDays = JSON.parse(JSON.stringify(source.monthDays))
    newOptions.places = source.places.slice()

    return newOptions
}

function CloneExclusiveOptions(source:object) {
    let clone = JSON.parse(JSON.stringify(source)) // Cópia superficial
    
    clone["members"] = source["members"].slice()
    
    let oldRoleset = source["roleset"]
    clone["roleset"] = new RoleSet(oldRoleset.name,oldRoleset.type,oldRoleset.set.slice(),false)
    clone["dayExceptions"] = source["dayExceptions"].slice()
    clone["places"] = source["places"].slice()
    return clone
}
