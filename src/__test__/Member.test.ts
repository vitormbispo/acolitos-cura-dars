import { MemberType } from "../app/classes/MemberData"
import { Member } from "../app/classes/members/Member"
import { MemberRepository } from "../app/classes/repository/MemberRepository"

test("Member instancing",()=>{

    let newMember:Member = new Member(MemberType.ACOLYTE,"João José","João J.","+55(13)98743-9856")
    expect(newMember.getName()).toEqual("João José")
    expect(newMember.getAvailability().dayAvailability).not.toBeNull()
})

test("Member insertion on table",() => {
    

})