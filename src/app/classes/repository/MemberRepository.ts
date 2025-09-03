import * as SQLite from "expo-sqlite"
import { Member } from "../members/Member"
import { MemberType } from "../MemberData"


type MemberObject = {
    id:number
    type:string
    name:string,
    nick:string,
    contact:string,
    parents:string
}

export class MemberRepository {
    
    private static database:SQLite.SQLiteDatabase


    public static async InitRepository() {
        this.database = await SQLite.openDatabaseAsync("CURADARS")
        await this.database.execAsync(`
            CREATE TABLE IF NOT EXISTS members (
	            id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
                type ENUM('ACOLYTE','COROINHA')
                name VARCHAR(100) NOT NULL,
                nick VARCHAR(20) NOT NULL,
                contact VARCHAR(20),
                parents VARCHAR(100)
            );
            `)
    }


    // CREATE
    public static async InsertMember(member:Member) {
        this.database.execAsync(`
            INSERT INTO members (type,name,nick,contact,parents) VALUES (
                "${member.getType()}"
                "${member.getName()}",
                "${member.getNick()}",
                "${member.getContact()}",
                "${member.getParents()}"
            )
            `)
    }

    //READ
    public static async FindMemberById(id:number) {
        const row:MemberObject = await this.database.getFirstAsync(`SELECT FROM members WHERE id=${id}`)
        if(row == null) return null
        
        let foundMember:Member = this.BuildMember(row)
        return foundMember
    }

    public static async FindAllMembers():Promise<Array<Member>> {
        let rows:Array<MemberObject> = await this.database.getAllAsync(`SELECT * FROM members`)
        let members:Array<Member> = this.BuildAllMembers(rows)
        return Promise.resolve(members)
    }

    public static async FindAllByMemberType(type:MemberType):Promise<Array<Member>> {
        let typeName:string = MemberType[type]
        let rows:Array<MemberObject> = await this.database.getAllSync(`SELECT * FROM members WHERE type="${typeName}"`)
        if(rows == null) return null
        let found:Array<Member> = this.BuildAllMembers(rows)
        return found
    }


    // UPDATE
    public static async UpdateMember(member:Member) {
        const result = await this.database.runAsync(`
            UPDATE members SET 
            type = "${member.getType}", 
            name = "${member.getName()}", 
            nick = "${member.getNick()}",
            contact = "${member.getContact}",
            parents = "${member.getParents()}"
            WHERE id = ${member.getId()}
            `)
        console.log(`UPDATED member with id: ${member.getId()}. ${result.changes} row(s) affected.`)
    }


    // DELETE
    public static async DeleteMemberById(id:number) {
        const result = await this.database.runAsync(`DELETE FROM members WHERE id=${id}`)
        console.log(`DELETED member with id: ${id}. ${result.changes} row(s) affected.`)
    }


    // Funções auxiliares
    private static BuildMember(obj:MemberObject):Member {
        let newMember = new Member(
                MemberType[obj.type],
                obj.name,
                obj.nick,
                obj.contact,
                obj.parents
            )
            newMember.setId(obj.id)
        return newMember
    }

    private static BuildAllMembers(members:Array<MemberObject>) {
        let builded:Array<Member> = []
        members.forEach(member => builded.push(this.BuildMember(member)))
        return builded
    }
}