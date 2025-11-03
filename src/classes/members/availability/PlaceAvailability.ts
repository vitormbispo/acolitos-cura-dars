import { Availability, AvailabilityTypes } from "./Availability";
import { Places } from "../Places";

export class PlaceAvailability extends Availability {
    constructor() {
        super()
        this.availabilityType = AvailabilityTypes.PLACES
    }

    public setAvailable(place:string,available:boolean): void {
        this.map[place] = available
    }

    public isAvailable(place:string): boolean {
        return this.map[place]
    }
    
    public static fromJSON(json:string):Availability {
        let obj = JSON.parse(json)
        let availability:PlaceAvailability = new PlaceAvailability()

        availability.id = obj.id
        availability.map = obj.map
        availability.memberType = obj.memberType
        availability.memberID = obj.memberId
        
        return availability
    }

    updateMap(): void {
        let availability:object = {}
        let curMap:object = this.map
        let places:Array<string> = Places.getPlaces()
        
        places.forEach((place)=> {
            availability[place] = Object.keys(curMap).includes(place) ? curMap[place] : true
        })

        this.map = availability
    }

    
}