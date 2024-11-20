/**
 * Classe base do acólito
 */
export class Acolyte {
    TYPE = "Acolyte" // Tipo de membro
    
    name="" // Nome
    nick="" // Apelido
    
    rodizio={"cero1":0, // Rodízio de função
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
}
    oldRodizio={"cero1":0, // Velho rodízio de função
    "cero2":0,
    "cruci":0,
    "turib":0,
    "navet":0,
    "libri":0,
}
    disp={ // Disponibilidade
        "1stWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "2ndWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "3rdWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "4thWE":{"sabado":true,"domingoPM":true,"domingoAM":true},
        "5thWE":{"sabado":true,"domingoPM":true,"domingoAM":true}
    }
    contact="" // Contato

    priority=0 // Prioridade geral
    oldPriority=0 // Velha prioridade geral
    
    weekendPriority={"sabado":0,"domingoPM":0,"domingoAM":0} // Prioridade de dia
    oldWeekendPriority={"sabado":0,"domingoPM":0,"domingoAM":0} // Velha prioridade de dia
    
    onLineup = true // Escalável

    lastWeekend = "" // Último fim de semana servido
}

/**
 *  Dados armazenados dos acólitos
 */
export class AcolyteData{ 
    static allAcolytes: Acolyte[] = []
    static allLineups = [];
}
