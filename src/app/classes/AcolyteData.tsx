
interface RolesDict{
    [key:string]:any
}

interface DispDict{
    [key:string]:any
}
export class Acolyte {
    name=""
    nick=""
    
    
    rodizio:RolesDict={"cero1":0,
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
}
    oldRodizio:RolesDict={"cero1":0,
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
}
    disp:DispDict={
        "1stWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "2ndWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "3rdWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "4thWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "5thWE":{"sabado":true,"domingoPM":true,"domingoAM":true}
    }
    contact=""

    oldPriority=0
    priority=0

    oldWeekendPriority:DispDict={"sabado":0,"domingoPM":0,"domingoAM":0}
    weekendPriority:DispDict={"sabado":0,"domingoPM":0,"domingoAM":0}

    onLineup = true

    lastWeekend = ""
}

export class AcolyteData{
    static allAcolytes: Acolyte[] = []

    
}
