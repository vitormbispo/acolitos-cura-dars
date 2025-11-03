export class MemberGenOptions {
    private _score:number
    private _priority:number
    private _dayPriority:object
    private _lastWeekend:string
    private _selectedOnLineups:Array<number>

    constructor(score:number=0,priority:number=0,dayPriority:object={},lastWeekend:string="",selectedOnLineups:Array<number>=[]) {
        this._score = score
        this._priority = priority
        this._dayPriority = dayPriority
        this._lastWeekend = lastWeekend
        this._selectedOnLineups = selectedOnLineups
    }

    public get score():number { return this._score }
    public set score(value:number) {this._score = value}

    public get priority(): number { return this._priority }
    public set priority(value: number) { this._priority = value }

    public get dayPriority(): object { return this._dayPriority }
    public set dayPriority(value: object) { this._dayPriority = value }

    public get lastWeekend(): string { return this._lastWeekend }
    public set lastWeekend(value: string) { this._lastWeekend = value }

    public get selectedOnLineups(): Array<number> { return this._selectedOnLineups }
    public set selectedOnLineups(value: Array<number>) { this._selectedOnLineups = value }

    public asJSON():string {
        return JSON.stringify(this)
    }

    public clone():MemberGenOptions {
        return MemberGenOptions.fromJSON(this.asJSON())
    }
    
    public static fromJSON(json:string):MemberGenOptions {
        const obj = JSON.parse(json)
        let newOptions = new MemberGenOptions()
        newOptions.score = obj.score
        newOptions.priority = obj.priority
        newOptions.dayPriority = obj.dayPriority
        newOptions.lastWeekend = obj.lastWeekend
        newOptions.selectedOnLineups = obj.selectedOnLineups
        return newOptions
    }

    
}