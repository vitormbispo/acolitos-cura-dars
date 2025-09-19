import { MemberAvailability } from "./availability/MemberAvailability"
import { MemberType } from "../MemberData"
import { MemberGenOptions } from "./MemberGenOptions"
import { MemberRotation } from "./MemberRotation"

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

    constructor(type:MemberType=MemberType.ACOLYTE,name:string="",nick:string="",contact:string="",parents:string="") {
        this.type = type
        this.name = name
        this.nick = nick
        this.contact = contact
        this.parents = parents
        
        this.rotation = new MemberRotation(type)
        this.availability = new MemberAvailability()
        this.genOptions = new MemberGenOptions()
    }

    public equals(other:Member) {
        return this.id == other.id
    }

    public clone(): Member {
        let newMember = new Member(
            this.type,
            this.name,
            this.nick,
            this.contact,
            this.parents
        )
        newMember.setAvailability(this.availability.clone())
        newMember.setRotation(this.rotation.clone())
        newMember.setGenOptions(this.genOptions.clone())
        newMember.setId(this.id)
        return newMember
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

    public getGenOptions(): MemberGenOptions { return this.genOptions }
    public setGenOptions(genOptions: MemberGenOptions) {this.genOptions = genOptions}

    public getRotation(): MemberRotation { return this.rotation }
    public setRotation(rotation: MemberRotation): void { this.rotation = rotation }

    public getAvailability(): MemberAvailability { return this.availability }
    public setAvailability(availability: MemberAvailability): void { this.availability = availability }
}