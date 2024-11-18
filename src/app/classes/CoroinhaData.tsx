/**
 * Classe base do coroinha
 */
export class Coroinha {
    TYPE = "Coroinha" // Tipo de memobro
    
    name="" // Nome
    nick="" // Apelido
    parents="" // Responsáveis
    
    rodizio={"donsE":0, // Rodízio de função
    "donsD":0,
    "cestE":0,
    "cestD":0,
    }
    
    oldRodizio={"donsE":0, // Velho rodízio de função
    "donsD":0, 
    "cestE":0,
    "cestD":0,
    }

    // Disponibilidade
    disp={ 
        "1stWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "2ndWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "3rdWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "4thWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "5thWE":{"sabado":true,"domingoPM":true,"domingoAM":true}
    }
    contact="" // Contato

    priority=0 // Prioridade
    oldPriority=0 // Velha prioridade

    weekendPriority={"sabado":0,"domingoPM":0,"domingoAM":0} // Prioridade de dia
    oldWeekendPriority={"sabado":0,"domingoPM":0,"domingoAM":0} // Velha prioridade de dia
    
    onLineup = true // Escalável

    lastWeekend = "" // Último fim de semana servido
}

/**
 * Dados dos coroinhas
 */
export class CoroinhaData{
    static allCoroinhas: Coroinha[] = []
    static allLineups: any[] = []
}


