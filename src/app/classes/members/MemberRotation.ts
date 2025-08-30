import { Rotation } from "./Rotation";

export class MemberRotation {
    public dayRotation:Rotation
    public placeRotation:Rotation
    public roleRotation:Rotation

    constructor(){
        this.dayRotation = new Rotation()
        this.placeRotation = new Rotation()
        this.roleRotation = new Rotation()
    }
}