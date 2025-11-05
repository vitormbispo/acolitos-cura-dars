import { MemberType } from "../MemberType"

export enum RotationTypes {
    DAYS,
    PLACES,
    ROLES
}

/**
 * Classe para armazenar rodízios
 */
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

    public getMemberType():MemberType { return this.memberType }
    public setMemberType(type:MemberType):void { this.memberType = type }
    
    /**
     * Aumenta o valor do rodízio da chave 'key' em 1 ou um valor determinado
     * @param key Chave
     */
    public increment(key:string,value:number=1):void {
        this.map[key]+=value
    }

    /**
     * Diminui o valor do rodízio da chave 'key' em 1 ou umm valor determinado
     * @param key Chave
     */
    public decrement(key:string,value:number=1):void {
        this.map[key]-=value
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

    /**
     * Converte esse objeto em formato JSON
     * @returns Uma `string` JSON desse objeto
     */
    public asJSON():string {
        return JSON.stringify(this)
    }

    /**
     * Cria um mapa de rodízio a partir de determinadas chaves
     * @param keys Chaves do mapa
     * @returns Objeto de rodízio
     */
    public static defaultRotationMap(keys:Array<string>):object {
        let map:object = {}
        keys.forEach(key => map[key] = 0)
        return map
    }

    /**
     * Cria um novo mapa de rodízio de dias e fins de semana
     * @param days Dias
     * @param weekends Fins de semana
     * @returns 
     */
    public static dayRotationMap(days:Array<string>,weekends:Array<string>):object {
        let map:object = {}

        weekends.forEach(
            weekend => days.forEach(
                day => {
                    if(map[weekend] == undefined) map[weekend] = {}
                    map[weekend][day] = 0
                }
            ))
        return map
    }

    /**
     * Atualiza o mapa que armazena o rodízio
     */
    abstract updateMap():void
}