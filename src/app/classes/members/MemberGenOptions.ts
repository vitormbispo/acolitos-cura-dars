export class MemberGenOptions {
    private score:number
    private priority:number
    private dayPriority:object
    private lastWeekend:string
    private selectedOnLineups:Array<number>

    constructor(score:number=0,priority:number=0,dayPriority:object={},lastWeekend:string="",selectedOnLineups:Array<number>=[]) {
        this.score = score
        this.priority = priority
        this.dayPriority = dayPriority
        this.lastWeekend = lastWeekend
        this.selectedOnLineups = selectedOnLineups
    }
    public getScore(): number { return this.score }
    public setScore(score: number): void {this.score = score}

    public getPriority(): number { return this.priority }
    public setPriority(priority: number): void { this.priority = priority }

    public getDayPriority(): object { return this.dayPriority }
    public setDayPriority(dayPriority: object): void { this.dayPriority = dayPriority }

    public getLastWeekend(): string { return this.lastWeekend }
    public setLastWeekend(lastWeekend: string): void { this.lastWeekend = lastWeekend }

    public getSelectedOnLineups(): Array<number> { return this.selectedOnLineups }
    public setSelectedOnLineups(selectedOnLineups: Array<number>): void { this.selectedOnLineups = selectedOnLineups }

    public asJSON() {
        return JSON.stringify(this)
    }
}