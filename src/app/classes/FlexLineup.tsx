import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

/**
 * Classe de escala flexível (funciona para acólitos, coroinhas e os dois juntos)
 */
export class FlexLineup{
    line = new Map<string,Coroinha|Acolyte>()
    members:Array<Coroinha|Acolyte>=[]

    day:any
    weekend:any
}
