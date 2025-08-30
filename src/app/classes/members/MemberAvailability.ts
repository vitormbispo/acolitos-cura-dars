import { Availability } from "./Availability";

export class MemberAvailability {
    public dayAvailability:Availability
    public placeAvailability:Availability

    constructor() {
        this.dayAvailability = new Availability()
        this.placeAvailability = new Availability()
    }
}