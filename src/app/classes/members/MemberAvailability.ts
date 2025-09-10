import { Availability } from "./Availability";
import { DayAvailability } from "./DayAvailability";
import { PlaceAvailability } from "./PlaceAvailability";

export class MemberAvailability {
    public dayAvailability:Availability
    public placeAvailability:Availability
    

    constructor() {
        this.dayAvailability = new DayAvailability()
        this.placeAvailability = new PlaceAvailability()

        this.dayAvailability.updateMap()
        this.placeAvailability.updateMap()
    }
}