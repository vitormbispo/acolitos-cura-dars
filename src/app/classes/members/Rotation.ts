import { MemberType } from "../MemberData"
import { Member } from "./Member"
import { Roles } from "../roles/Roles"

export enum RotationTypes {
    DAYS,
    PLACES,
    ROLES
}

export abstract class Rotation {
    protected id:number
    protected map:object
    protected rotationType:RotationTypes
    protected memberType:MemberType
    
    constructor(memberType:MemberType) {
        this.setMemberType(memberType)
        this.map = {}
    }

    public getId():number {return this.id}
    public setId(id:number):void {this.id = id}
    
    public getMap():object { return this.map }
    public setMap(map:object):void { this.map = map }

    public getRotationType(): RotationTypes { return this.rotationType }
    public setRotationType(type:RotationTypes): void { this.rotationType = type }

    public abstract getRotation(...args:any): number
    public abstract setRotation(...args:any): void

    public getMemberType():MemberType {
        return this.memberType
    }

    public setMemberType(type:MemberType):void {
        this.memberType = type
    }
    
    /**
     * Aumenta o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    public increment(key:string):void {
        this.map[key]+=1
    }

    /**
     * Diminui o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    public decrement(key:string):void {
        this.map[key]-=1
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    public removeKey(key:string):void {
        delete this.map[key]
    }

    /**
     * Reinicia o valor da chave 'key' para 0
     * @param key Chave
     */
    public resetKey(key:string):void {
        this.map[key] = 0
    }

    public asJSON():string {
        return JSON.stringify(this)
    }

    public static defaultRotationMap(keys:Array<string>):object {
        let map:object = {}
        keys.forEach(key => map[key] = 0)
        return map
    }

    public static dayRotationMap(days:Array<string>,weekends:Array<string>):object {
        let map:object = {}

        weekends.forEach(
            weekend => days.forEach(
                day => {
                    if(map[weekend] == undefined) map[weekend] = {}
                    map[weekend][day] = 1
                }
            ))
        return map
    }

    abstract updateMap():void
}