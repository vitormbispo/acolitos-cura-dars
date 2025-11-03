import { Rotation, RotationTypes } from "./Rotation";
import { Places } from "./Places";
import { MemberType } from "./MemberType";

export class PlaceRotation extends Rotation{
    constructor(memberType:MemberType=MemberType.ACOLYTE) {
        super(memberType)
        this.rotationType = RotationTypes.PLACES
        
    }

    public setRotation(place:string,value:number=0) {
        this.map[place] = value
    }

    public getRotation(place:string): number{
        return this.map[place]
    }

    public static fromJSON(json:string):PlaceRotation {
            let obj = JSON.parse(json)
            let availability:PlaceRotation = new PlaceRotation()
    
            availability.setId(obj.id)
            availability.setMap(obj.map)
            availability.setMemberType(obj.memberType)
            
            return availability
        }

    public updateMap(): void {
        let rotation:object = {}
        let curMap:object = this.getMap()

        Places.getPlaces().forEach( place => {
            rotation[place] = curMap[place] != undefined ? curMap[place] : 0
        })

        this.setMap(rotation)
    }
}