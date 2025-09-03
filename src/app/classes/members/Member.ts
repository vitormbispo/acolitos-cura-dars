import { Dates } from "./Dates"
import { MemberAvailability } from "./MemberAvailability"
import { MemberType } from "../MemberData"
import { MemberGenOptions } from "./MemberGenOptions"
import { MemberRotation } from "./MemberRotation"
import { Places } from "../Places"
import { Roles } from "./Roles"
import { Rotation } from "./Rotation"

export class Member {
    private id:number
    private type:MemberType
    private name:string
    private nick:string
    private contact:string
    private parents:string

    public rotation:MemberRotation
    public availability:MemberAvailability
    
    public genOptions:MemberGenOptions

    constructor(type:MemberType,name:string,nick:string,contact:string,parents:string="") {
        this.type = type
        this.name = name
        this.nick = nick
        this.contact = contact
        this.parents = parents
        
        this.rotation = new MemberRotation()

        this.rotation.placeRotation.setMap(Places.defaultPlaces)

        switch(type) {
            case MemberType.ACOLYTE: {
                this.rotation.roleRotation.setMap(Rotation.defaultRotationMap(Roles.DEFAULT_ACOLYTE_ROLES))
                this.rotation.dayRotation.setMap(Rotation.dayRotationMap(Dates.days,Dates.weekends))
            }

            case MemberType.COROINHA: {
                this.rotation.roleRotation.setMap(Rotation.defaultRotationMap(Roles.DEFAULT_COROINHA_ROLES))
            }
        }

        this.availability = new MemberAvailability()
    }
    public getId(): number {return this.id}
    public setId(id:number): void {this.id = id}

    public getType(): MemberType {return this.type}
    public setType(type:MemberType): void {this.type = type}

    public getName(): string { return this.name }
    public setName(name: string): void { this.name = name }

    public getNick(): string { return this.nick }
    public setNick(nick: string): void { this.nick = nick }

    public getContact(): string { return this.contact }
    public setContact(contact: string): void { this.contact = contact }

    public getParents(): string { return this.parents }
    public setParents(parents: string): void { this.parents = parents }
}