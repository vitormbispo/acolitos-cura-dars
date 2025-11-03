import { MemberGenOptions } from "../classes/members/MemberGenOptions";

test('Gen Options as JSON', () => {
    let options: MemberGenOptions = new MemberGenOptions()
    options.score = 10
    options.dayPriority = {"Sab":10,"Dom":5}
    options.priority = 10
    options.lastWeekend = "1º"
    options.selectedOnLineups = []

    expect(JSON.parse(options.asJSON())).toEqual({score:10,priority:10,dayPriority:{"Sab":10,"Dom":5},lastWeekend:"1º",selectedOnLineups:[]})
});
