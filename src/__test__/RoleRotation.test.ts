import { MemberType } from "../classes/MemberData";
import { RoleRotation } from "../classes/members/RoleRotation";


test('update acolyte RoleRotation map', () => {
    let rot:RoleRotation = new RoleRotation(MemberType.ACOLYTE)
    rot.updateMap()
    expect(rot.getMap()).toEqual({
        "Ceroferário 1":0,
        "Ceroferário 2":0,
        "Cruciferário":0,
        "Turiferário":0,
        "Naveteiro":0,
        "Librífero":0
    })
});

test("update coroinha RoleRotation map",() => {
    let rot = new RoleRotation(MemberType.ACOLYTE)
    rot.setMemberType(MemberType.COROINHA)
    rot.updateMap()
    expect(rot.getMap()).toEqual({
        "Dons D.":0,
        "Dons E.":0,
        "Cestinho D.":0,
        "Cestinho E.":0
    })
})

test("update existing coroinha RoleRotation map",() => {
    let rot = new RoleRotation(MemberType.ACOLYTE)
    rot.setMemberType(MemberType.COROINHA)
    rot.setMap({
        "Dons D.": 10,
        "Dons E.": 5,
        "Ceroferário 1": 5
    })

    rot.updateMap()
    expect(rot.getMap()).toEqual({
        "Dons D.":10,
        "Dons E.":5,
        "Cestinho D.":0,
        "Cestinho E.":0
    })
})
