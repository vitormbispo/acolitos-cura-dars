import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

interface RolesDict{
    [key:string]:any
}


export class FlexLineup{
    line = new Map<string,Coroinha|Acolyte>()
    members:Array<Coroinha|Acolyte>=[]

    day:any
    weekend:any
}
