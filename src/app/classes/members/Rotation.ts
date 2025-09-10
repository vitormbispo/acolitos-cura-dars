import { MemberType } from "../MemberData"
import { Member } from "./Member"
import { Roles } from "./Roles"

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
    protected memberRef:Member
    
    constructor(memberRef:Member) {
        this.memberRef = memberRef
        this.memberType = memberRef.getType()
        this.map = {}
    }

    getId():number {return this.id}
    setId(id:number):void {this.id = id}

    getMemberRef():Member {return this.memberRef}
    setMemberRef(ref:Member):void {this.memberRef = ref}
    
    getMap():object { return this.map }
    setMap(map:object):void { this.map = map }

    getRotationType(): RotationTypes { return this.rotationType }
    setRotationType(type:RotationTypes): void { this.rotationType = type }


    /**
     * Retorna o valor do rodízio de chave 'key'
     * @param key Chave
     * @returns Valor do rodízio
     */
    getRotation(key:string): number {
        return this.map[key]
    }

    /**
     * Cria ou atualiza o valor 'value' do rodízio de chave 'key'
     * @param key Chave
     * @param value Valor
     */
    setRotation(key:string,value:number=0):void {
        this.map[key] = value
    }

    getMemberType():MemberType {
        return this.memberType
    }

    setMemberType(type:MemberType):void {
        this.memberType = type
    }
    
    /**
     * Aumenta o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    increment(key:string):void {
        this.map[key]+=1
    }

    /**
     * Diminui o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    decrement(key:string):void {
        this.map[key]-=1
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    removeRotationKey(key:string):void {
        delete this.map[key]
    }

    /**
     * Reinicia o valor da chave 'key' para 0
     * @param key Chave
     */
    resetKey(key:string):void {
        this.map[key] = 0
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