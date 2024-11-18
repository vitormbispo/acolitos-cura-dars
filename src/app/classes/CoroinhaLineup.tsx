import { Coroinha } from "./CoroinhaData";

/**
 * Classe base de uma escala de coroinha
 */
export class CoroinhaLineup{
    line = new Map<string,Coroinha>()
    coroinhas:any=[]

    day:any
    weekend:any
}
