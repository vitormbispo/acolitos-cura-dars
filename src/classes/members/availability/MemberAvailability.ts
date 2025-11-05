import { Member } from "../Member";
import { Availability } from "./Availability";
import { DayAvailability } from "./DayAvailability";
import { PlaceAvailability } from "./PlaceAvailability";

export class MemberAvailability {
    private available:boolean
    public dayAvailability:DayAvailability
    public placeAvailability:Availability
    

    constructor() {
        this.available = true
        this.dayAvailability = new DayAvailability()
        this.placeAvailability = new PlaceAvailability()

        this.dayAvailability.updateMap()
        this.placeAvailability.updateMap()
    }

    public setAvailable(isAvailable:boolean): void { this.available = isAvailable }
    public isAvailable(): boolean {return this.available}

    /**
     * Converte esse objeto em formato JSON
     * @returns Uma `string` JSON desse objeto
     */
    public asJSON():string {
        let obj:object = {
            "available":this.available,
            "dayAvailability":this.dayAvailability.asJSON(),
            "placeAvailability":this.placeAvailability.asJSON()
        }
        return JSON.stringify(obj)
    }

    /**
     * Cria um objeto `MemberAvailability` a partir de um JSON
     * @param json JSON
     * @returns `MemberAvailability` referente ao JSON
     */
    public static fromJSON(json:string):MemberAvailability {
        let obj = JSON.parse(json)
        let availability = new MemberAvailability()
        availability.available = obj.available
        availability.dayAvailability = DayAvailability.fromJSON(obj.dayAvailability)
        availability.placeAvailability = PlaceAvailability.fromJSON(obj.placeAvailability)

        availability.dayAvailability.updateMap()
        availability.placeAvailability.updateMap()

        return availability
    }
    /**
     * Copia o objeto
     * @returns Um novo objeto copiando este
     */
    public clone(): MemberAvailability {
        return MemberAvailability.fromJSON(this.asJSON())
    }

}