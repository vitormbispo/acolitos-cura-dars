import { PlaceAvailability } from "./PlaceAvailability"
import { MemberType } from "../../MemberData"
import { DayAvailability } from "./DayAvailability"

export enum AvailabilityTypes {
    DAYS,
    PLACES,
    ROLES
}

export abstract class Availability {
    private _id:number
    private _map:object
    private _memberType:MemberType
    private _availabilityType:AvailabilityTypes
    private _memberID:number

    constructor() {
        this._map = {}
    }

    public get id():number { return this._id }
    public set id(value:number) { this._id = value }

    public get map(): object { return this._map }
    public set map(value: object) { this._map = value }

    public get memberType(): MemberType { return this._memberType }
    public set memberType(value: MemberType) { this._memberType = value }

    public get availabilityType(): AvailabilityTypes { return this._availabilityType }
    public set availabilityType(value: AvailabilityTypes) { this._availabilityType = value }

    public get memberID(): number { return this._memberID }
    public set memberID(value: number) { this._memberID = value }

    /**
     * Verifica se há disponibilidade para determinada chave
     * @param key Chave
     * @returns true se houver disponibilidade
     */
    public abstract isAvailable(...args:any): boolean
    
    /**
     * Define se há disponibilidade para determinada chave.
     * 
     * @param key Chave
     * @param available Disponível
     */
    public abstract setAvailable(...args:any): void

    /**
     * Define todos os valores do mapa para um determinado valor 'value'
     * @param value Valor
     */
    public setAll(value:boolean) {
        Object.keys(this._map).forEach((key) => { this._map[key] = value })
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    removeKey(key:string):void {
        delete this._map[key]
    }

    public asJSON():string {
        return JSON.stringify(this)
    }

    public abstract updateMap():void
}