import * as SQLite from "expo-sqlite"
import { Member } from "../members/Member"
import { MemberType } from "../MemberData"
import { Migrations } from "./migrations/Migrations"
import migration from "./migrations/json/member_migrations.json"
import { MemberGenOptions } from "../members/MemberGenOptions"
import { Availability } from "../members/availability/Availability"
import { MemberAvailability } from "../members/availability/MemberAvailability"
import { MemberRotation } from "../members/MemberRotation"

export type MemberObject = {
    id:number
    type:string
    name:string,
    nick:string,
    contact:string,
    parents:string,
    genOptions:string,
    availability:string,
    rotation:string
}

export class MemberRepository {
    
    public static database
    
    public static async InitRepository() {
        this.database = await SQLite.openDatabaseAsync("CURADARS")
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = TRUE;
            CREATE TABLE IF NOT EXISTS members (
	            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                type VARCHAR(15) NOT NULL,
                name VARCHAR(100) NOT NULL,
                nick VARCHAR(20) NOT NULL,
                contact VARCHAR(20),
                parents VARCHAR(100),
                genOptions TEXT,
                availability TEXT,
                rotation TEXT
            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
        const version:number = await this.database.getFirstAsync("PRAGMA user_version");
        Migrations.Migrate(version["user_version"],migration)
            .then(
                v => { console.log("Migrated from version "+version["user_version"]+" to "+v) },
                e => { console.error("Error: "+e) }
            )
    }

    // CREATE
    public static async InsertMemberAsync(member:Member) {
        const typeName:string = MemberType[member.getType()]

        return this.database.runAsync(`
            INSERT INTO members (type,name,nick,contact,parents,genOptions,availability,rotation) VALUES (
                "${typeName}",
                "${member.getName()}",
                "${member.getNick()}",
                "${member.getContact()}",
                "${member.getParents()}",
                '${member.getGenOptions().asJSON()}',
                '${member.getAvailability().asJSON()}',
                '${member.getRotation().asJSON()}'
            )
            `).then(result => member.setId(result.lastInsertRowId),e => console.error("Error: "+e))
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
            contact = "${member.getContact()}",
            parents = "${member.getParents()}",
            genOptions = '${member.genOptions.asJSON()}',
            availability = '${member.getAvailability().asJSON()}',
            rotation = '${member.getRotation().asJSON()}'
            WHERE id = ${member.getId()}
            `)
        console.log(`UPDATED member with id: ${member.getId()}. ${result.changes} row(s) affected.`)
        return result
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
        
        let result = this.database.runSync(`
            INSERT INTO members (type,name,nick,contact,parents,genOptions,availability,rotation) VALUES (
                "${typeName}",
                "${member.getName()}",
                "${member.getNick()}",
                "${member.getContact()}",
                "${member.getParents()}",
                '${member.getGenOptions().asJSON()}',
                '${member.getAvailability().asJSON()}',
                '${member.getRotation().asJSON()}'
            )
            `)
        member.setId(result.lastInsertRowId)
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
            contact = "${member.getContact()}",
            parents = "${member.getParents()}",
            genOptions = '${member.genOptions.asJSON()}',
            availability = '${member.getAvailability().asJSON()}',
            rotation = '${member.getRotation().asJSON()}'
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
        let opt = JSON.parse(obj.genOptions)
        
        let genOptions:MemberGenOptions = new MemberGenOptions(0,opt.priority,opt.dayPriority,opt.lastWeekend,opt.selectedOnLineups)
        newMember.setGenOptions(genOptions)

        if(obj.availability == "" || obj.availability == null) {
            newMember.setAvailability(new MemberAvailability())
        } 
        else {
            newMember.setAvailability(MemberAvailability.fromJSON(obj.availability))
        }

        if(obj.rotation == "" || obj.rotation == null) {
            newMember.setRotation(new MemberRotation(MemberType[obj.type]))
        } 
        else {
            newMember.setRotation(MemberRotation.fromJSON(obj.rotation))
        }
        
            
        return newMember
    }

    public static BuildAllMembers(members:Array<MemberObject>) {
        let builded:Array<Member> = []
        members.forEach(member => builded.push(this.BuildMember(member)))
        return builded
    }
}