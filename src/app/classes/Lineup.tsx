import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";
import { CoroinhaLineup } from "./CoroinhaLineup";

/**
 * Classe base de uma escala de acólitos
 */
export class Lineup{
    TYPE = "single"
    line = new Map<string,Acolyte>()
    acolytes:any=[]

    day:string = ""
    weekend:string = ""
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
    daysMaps:Map<string,string> = new Map<string,string>([
        ["sabado","Sábado - 19h"],
        ["domingoAM","Domingo - 08h"],
        ["domingoPM","Domingo - 19h"]])
    lineups:Array<Lineup|CoroinhaLineup> = []
    monthLineups:Map<string,Array<Lineup|CoroinhaLineup>> = new Map<string,Array<Lineup|CoroinhaLineup>>()
    allLineups:Array<Lineup|CoroinhaLineup> = new Array<Lineup|CoroinhaLineup>()
}

