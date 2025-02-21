import { RoleSet } from "./Roles";


export enum LineupType {
    SINGLE,
    WEEKEND,
    MONTH
}
/**
 * Classe base de uma escala de acólitos
 */
export class Lineup{
    TYPE = LineupType.SINGLE
    line = {}
    members:any=[]
    roleset:RoleSet
    day:string = ""
    weekend:string = ""
}

/**
 * Tipo do objeto para armazenar tags de dias
 * e seu respectivo nome
 * Ex: (tag)sabado:(nome)Sábado - 19h
 */
type DaysAndNames = {
    sabado:string,
    domingoAM:string,
    domingoPM:string
}
/**
 * Classe para uma escala montada a ser exibida na tela de escalas.
 */
export class StructuredLineup{
    name = "NewLineup"
    lineupType = "Single" // Tipo da escala
    roles = ["cero1","cero2","cruci","turib","navet","libri"]
    rolesNames = ["Ceroferario 1","Ceroferario 2","Cruciferário","Turiferário","Naveteiro","Librífero"]

    days = ["sabado","domingoAM","domingoPM"]
    daysNames = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    daysMaps:DaysAndNames = {
        sabado:"Sábado - 19h",
        domingoAM:"Domingo - 08h",
        domingoPM:"Domingo - 19h"
    }
        
    lineups:Array<Lineup> = []
    monthLineups:object = {}
    allLineups:Array<Lineup> = new Array<Lineup>()
}

