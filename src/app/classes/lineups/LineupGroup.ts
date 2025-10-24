import { MemberType } from "../MemberData"
import { Lineup } from "./Lineup"

/**
 * Classe para uma escala montada a ser exibida na tela de escalas.
 */
export class LineupGroup{
    private _id:number
    private _name:string
    private _lineups:Array<Lineup>
    private _places:Array<string> // Locais selecionados
    private _type:MemberType
    private _monthLineupsMap:object // Ex.: "1stWE":[Lineup,Lineup,Lineup]

    constructor(name:string,lineups:Array<Lineup>=[],places:Array<string>=[],monthLineupsMap:object={}) {
        this.name = name
        this.lineups = lineups
        this.places = places
        this.monthLineupsMap = monthLineupsMap
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }
    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get lineups(): Array<Lineup> {
        return this._lineups;
    }

    public set lineups(value: Array<Lineup>) {
        this._lineups = value;
    }

    public get places(): Array<string> {
        return this._places;
    }

    public set places(value: Array<string>) {
        this._places = value;
    }

    public get type(): MemberType{
        return this._type;
    }

    public set type(value: MemberType) {
        this._type = value;
    }

    public get monthLineupsMap(): object {
        return this._monthLineupsMap;
    }

    public set monthLineupsMap(value: object) {
        this._monthLineupsMap = value;
    }
}