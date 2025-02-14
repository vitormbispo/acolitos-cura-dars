import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";
import { Member } from "./MemberData";

/**
 * Classe de escala flexível (funciona para acólitos, coroinhas e os dois juntos)
 */
export class FlexLineup{
    line = new Map<string,Member>()
    members:Array<Member>=[]

    day:any
    weekend:any
}
