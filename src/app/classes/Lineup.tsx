import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

interface RolesDict{
    [key:string]:any
}

export class Lineup{
    TYPE = "single"
    line = new Map<string,Acolyte>()
    acolytes:any=[]

    day:string = ""
    weekend:string = ""
}

export class WeekendLineup{
    TYPE = "weekend"
    lines = new Map<string,Lineup>
}

export class MonthLineup{
    name = "NewLineup"
    TYPE = "Month"
    lines = new Map<string,Array<Lineup>>()
    monthLines = []
}

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
    lineups:Array<Lineup> = []
    monthLineups:Map<string,Array<Lineup>> = new Map<string,Array<Lineup>>()
    allLineups:Array<Lineup> = new Array<Lineup>()
}

