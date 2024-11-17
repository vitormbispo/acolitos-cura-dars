
interface RolesDict{
    [key:string]:any
}

interface DispDict{
    [key:string]:any
}
export class Coroinha {
    TYPE = "Coroinha"
    
    name=""
    nick=""
    parents=""
    
    rodizio:RolesDict={"donsE":0,
    "donsD":0,
    "cestE":0,
    "cestD":0,
    }
    
    oldRodizio:RolesDict={"donsE":0,
    "donsD":0,
    "cestE":0,
    "cestD":0,
    }

    
    disp:DispDict={
        "1stWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "2ndWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "3rdWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "4thWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "5thWE":{"sabado":true,"domingoPM":true,"domingoAM":true}
    }
    contact=""

    priority=0
    oldPriority=0
    oldWeekendPriority:DispDict={"sabado":0,"domingoPM":0,"domingoAM":0}

    weekendPriority:DispDict={"sabado":0,"domingoPM":0,"domingoAM":0}

    onLineup = true

    lastWeekend = ""
}

export class CoroinhaData{
    static allCoroinhas: Coroinha[] = []
    static allLineups: any[] = []
}


