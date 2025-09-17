import { MemberGenOptions } from "../app/classes/members/MemberGenOptions";

test('Gen Options as JSON', () => {
    let options: MemberGenOptions = new MemberGenOptions()
    options.setScore(10)
    options.setDayPriority({"Sab":10,"Dom":5})
    options.setPriority(10)
    options.setLastWeekend("1º")
    options.setSelectedOnLineups([])

    expect(JSON.parse(options.asJSON())).toEqual({score:10,priority:10,dayPriority:{"Sab":10,"Dom":5},lastWeekend:"1º",selectedOnLineups:[]})
});
