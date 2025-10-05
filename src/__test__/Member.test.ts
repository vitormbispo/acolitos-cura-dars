import { MemberType } from "../app/classes/MemberData"
import { Member } from "../app/classes/members/Member"
import { MemberRepository } from "../app/classes/repository/MemberRepository"

test("Member instancing",()=>{

    let newMember:Member = new Member(MemberType.ACOLYTE,"João José","João J.","+55(13)98743-9856")
    expect(newMember.name).toEqual("João José")
    expect(newMember.availability.dayAvailability).not.toBeNull()
})

test("Member cloning",() => {
    let newMember:Member = new Member(MemberType.ACOLYTE,"João José","João J.","+55(13)98743-9856")
    let clone = newMember.clone()
    clone.name = "Lucas José"
    expect(newMember.name).toEqual("João José")
    expect(clone.name).toEqual("Lucas José")

    newMember.availability.placeAvailability.setAvailable("Matriz",false)
    clone.availability.placeAvailability.setAvailable("Matriz",true)

    expect(newMember.availability.placeAvailability.isAvailable("Matriz")).toEqual(false)
    expect(clone.availability.placeAvailability.isAvailable("Matriz")).toEqual(true)
})