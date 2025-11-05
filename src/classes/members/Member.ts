import { MemberAvailability } from "./availability/MemberAvailability"
import { MemberGenOptions } from "./MemberGenOptions"
import { MemberRotation } from "./rotation/MemberRotation"
import { MemberType } from "./MemberType"

export class Member {
    private _id:number
    private _type:MemberType
    private _name:string
    private _nick:string
    private _contact:string
    private _parents:string

    public rotation:MemberRotation
    public availability:MemberAvailability
    public genOptions:MemberGenOptions

    constructor(type:MemberType=MemberType.ACOLYTE,name:string="",nick:string="",contact:string="",parents:string="") {
        this._type = type
        this._name = name
        this._nick = nick
        this._contact = contact
        this._parents = parents
        
        this.rotation = new MemberRotation(type)
        this.availability = new MemberAvailability()
        this.genOptions = new MemberGenOptions()
    }

    public equals(other:Member) {
        return this._id == other._id
    }

    public clone(): Member {
        let newMember = new Member(
            this._type,
            this._name,
            this._nick,
            this._contact,
            this._parents
        )
        newMember.availability = this.availability.clone()
        newMember.rotation = this.rotation.clone()
        newMember.genOptions = this.genOptions.clone()
        newMember.id = this._id
        return newMember
    }

    public get id():number { return this._id }
    public set id(value:number) { this._id = value }

    public get type():MemberType { return this._type } 
    public set type(value:MemberType) { this._type = value }

    public get name():string { return this._name }
    public set name(value:string) { this._name = value }

    public get nick(): string { return this._nick }
    public set nick(value: string) { this._nick = value }

    public get contact(): string { return this._contact }
    public set contact(value: string) { this._contact = value }

    public get parents(): string { return this._parents }
    public set parents(value: string) { this._parents = value }
}