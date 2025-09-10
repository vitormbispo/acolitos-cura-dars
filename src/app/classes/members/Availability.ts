import { MemberType } from "../MemberData"

export enum AvailabilityTypes {
    DAYS,
    PLACES,
    ROLES
}

export abstract class Availability {
    private id:number
    private map:object
    private memberType:MemberType
    private availabilityType:AvailabilityTypes
    private memberId:number

    constructor() {
        this.map = {}
    }


    public getId(): number { return this.id }
    public setId(id:number): void { this.id = id }

    public getMemberId(): number { return this.memberId }
    public setMemberId(id:number): void { this.memberId = id }

    public getMap(): object { return this.map }
    public setMap(map:object) :void { this.map = map }

    public getMemberType(): MemberType { return this.memberType}
    public setMemberType(memberType:MemberType): void {this.memberType = memberType}

    public getAvailabilityType(): AvailabilityTypes { return this.availabilityType}
    public setAvailabilityType(availabilityType:AvailabilityTypes): void {this.availabilityType = availabilityType}

    /**
     * Verifica se há disponibilidade para determinada chave
     * @param key Chave
     * @returns true se houver disponibilidade
     */
    public isAvailable(key:string):boolean {
        return this.map[key];
    }
    
    /**
     * Define se há disponibilidade para determinada chave.
     * 
     * @param key Chave
     * @param available Disponível
     */
    public setAvailable(key:string,available:boolean) {
        this.map[key] = available
    }

    /**
     * Define todos os valores do mapa para um determinado valor 'value'
     * @param value Valor
     */
    public setAll(value:boolean) {
        Object.keys(this.map).forEach((key) => { this.map[key] = value })
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    removeKey(key:string):void {
        delete this.map[key]
    }

    abstract updateMap():void
}