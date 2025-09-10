import * as SQLite from "expo-sqlite"
import { Member } from "../members/Member"
import { MemberType } from "../MemberData"


export type MemberObject = {
    id:number
    type:string
    name:string,
    nick:string,
    contact:string,
    parents:string
}

export class MemberRepository {
    
    public static database = SQLite.openDatabaseSync("CURADARS")
    
    public static async InitRepository() {
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS members (
	            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                type VARCHAR(15),
                name VARCHAR(100) NOT NULL,
                nick VARCHAR(20) NOT NULL,
                contact VARCHARa(20),
                parents VARCHAR(100)
            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
    }

    // CREATE
    public static async InsertMemberAsync(member:Member) {
        const typeName:string = MemberType[member.getType()]
        return this.database.runAsync(`
            INSERT INTO members (type,name,nick,contact,parents) VALUES (
                "${typeName}",
                "${member.getName()}",
                "${member.getNick()}",
                "${member.getContact()}",
                "${member.getParents()}"
            )
            `).catch(e => "Error: " + e)
    }

    //READ
    public static async FindMemberByIdAsync(id:number) {
        const row:MemberObject = await this.database.getFirstAsync(`SELECT * FROM members WHERE id=${id}`)
        if(row == null) return Promise.reject(`Member with id:${id} was not found.`)
        
        let foundMember:Member = this.BuildMember(row)
        return Promise.resolve(foundMember)
    }

    public static async FindAllMembersAsync():Promise<Array<Member>> {
        let rows:Array<MemberObject> = await this.database.getAllAsync(`SELECT * FROM members`)
        let members:Array<Member> = this.BuildAllMembers(rows)
        return Promise.resolve(members)
    }

    public static async FindAllByMemberTypeAsync(type:MemberType):Promise<Array<Member>> {
        let typeName:string = MemberType[type]
        let rows:Array<MemberObject> = await this.database.getAllAsync(`SELECT * FROM members WHERE type="${typeName}"`)
        let found:Array<Member> = this.BuildAllMembers(rows)
        
        return Promise.resolve(found)
    }


    // UPDATE
    public static async UpdateMemberAsync(member:Member) {
        let typeName:string = MemberType[member.getType()]
        const result = await this.database.runAsync(`
            UPDATE members SET 
            type = "${typeName}", 
            name = "${member.getName()}", 
            nick = "${member.getNick()}",
            contact = "${member.getContact}",
            parents = "${member.getParents()}"
            WHERE id = ${member.getId()}
            `)
        console.log(`UPDATED member with id: ${member.getId()}. ${result.changes} row(s) affected.`)
    }


    // DELETE
    public static async DeleteMemberByIdAsync(id:number) {
        const result = await this.database.runAsync(`DELETE FROM members WHERE id=${id}`)
        console.log(`DELETED member with id: ${id}. ${result.changes} row(s) affected.`)
    }

    public static async DeleteAllAsync() {
        const result = await this.database.runAsync(`DELETE FROM members`)
        console.log(`DELETED ALL MEMBERS. ${result.changes} row(s) affected.`)
    }


    // CREATE
    public static InsertMember(member:Member) {
        const typeName:string = MemberType[member.getType()]
        return this.database.runSync(`
            INSERT INTO members (type,name,nick,contact,parents) VALUES (
                "${typeName}",
                "${member.getName()}",
                "${member.getNick()}",
                "${member.getContact()}",
                "${member.getParents()}"
            )
            `)
    }

    //READ
    public static FindMemberById(id:number) {
        const row:MemberObject = this.database.getFirstSync(`SELECT * FROM members WHERE id=${id}`)
        if(row == null) return null
        
        let foundMember:Member = this.BuildMember(row)
        return foundMember
    }

    public static FindAllMembers():Array<Member> {
        let rows:Array<MemberObject> = this.database.getAllSync(`SELECT * FROM members`)
        let members:Array<Member> = this.BuildAllMembers(rows)
        return members
    }

    public static FindAllByMemberType(type:MemberType):Array<Member> {
        let typeName:string = MemberType[type]
        let rows:Array<MemberObject> = this.database.getAllSync(`SELECT * FROM members WHERE type="${typeName}"`)
        let found:Array<Member> = this.BuildAllMembers(rows)
        
        return found
    }

    // UPDATE
    public static UpdateMember(member:Member): void {
        let typeName:string = MemberType[member.getType()]
        const result = this.database.runSync(`
            UPDATE members SET 
            type = "${typeName}", 
            name = "${member.getName()}", 
            nick = "${member.getNick()}",
            contact = "${member.getContact}",
            parents = "${member.getParents()}"
            WHERE id = ${member.getId()}
            `)
        console.log(`UPDATED member with id: ${member.getId()}. ${result.changes} row(s) affected.`)
    }


    // DELETE
    public static DeleteMemberById(id:number) {
        const result = this.database.runSync(`DELETE FROM members WHERE id=${id}`)
        console.log(`DELETED member with id: ${id}. ${result.changes} row(s) affected.`)
    }

    public static DeleteAll() {
        const result = this.database.runSync(`DELETE FROM members`)
        console.log(`DELETED ALL MEMBERS. ${result.changes} row(s) affected.`)
    }


    // Funções auxiliares
    public static BuildMember(obj:MemberObject):Member {
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

    public static BuildAllMembers(members:Array<MemberObject>) {
        let builded:Array<Member> = []
        members.forEach(member => builded.push(this.BuildMember(member)))
        return builded
    }
}