import { Availability, AvailabilityTypes } from "./Availability";
import { Places } from "../Places";

export class PlaceAvailability extends Availability {
    constructor() {
        super()
        this.setAvailabilityType(AvailabilityTypes.PLACES)
    }

    public setAvailable(place:string,available:boolean): void {
        this.getMap()[place] = available
    }

    public isAvailable(place:string): boolean {
        return this.getMap()[place]
    }
    
    public static fromJSON(json:string):Availability {
        let obj = JSON.parse(json)
        let availability:PlaceAvailability = new PlaceAvailability()

        availability.setId(obj.id)
        availability.setMap(obj.map)
        availability.setMemberType(obj.memberType)
        availability.setMemberId(obj.memberId)
        
        return availability
    }

    updateMap(): void {
        let availability:object = {}
        let curMap:object = this.getMap()
        let places:Array<string> = Places.getPlaces()
        
        places.forEach((place)=> {
            availability[place] = Object.keys(curMap).includes(place) ? curMap[place] : true
        })

        this.setMap(availability)
    }

    
}