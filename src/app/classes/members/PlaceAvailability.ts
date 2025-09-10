import { Availability } from "./Availability";
import { Places } from "./Places";

export class PlaceAvailability extends Availability {
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