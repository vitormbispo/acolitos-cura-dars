import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'

export type LineupMemberObject = {
    id:number,
    role:string,
    member_id:number,
    lineup_id:number
} 

export class LineupMembersRepository {
    private static database:SQLite.SQLiteDatabase

    public static InitializeRepository() {
        this.database = RepositoryManager.database
        return this.database.execAsync(`
            PRAGMA foreign_keys=ON;
            CREATE TABLE IF NOT EXISTS lineup_members (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                role VARCHAR(50),
                member_id INTEGER REFERENCES members(id),
                lineup_id INTEGER REFERENCES lineups(id)
            );`)
    }

    public static InsertLineupMember(role:string,memberID:number,lineupID:number) {
        let result:SQLite.SQLiteRunResult
        
        try {
            this.database.runSync(`
                INSERT INTO lineup_members (role, member_id, lineup_id) VALUES (
                "${role}",
                ${memberID},
                ${lineupID}
            );`)
        } catch (e) {
            console.error(e)
        }

        return result
    }

    public static FindLineupMemberByID(id:number):object {
        let result:object
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM lineup_members WHERE id=${id};`)
        } catch(e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdateLineupRole(id:number, newRole:string, newMemberId:number, newLineupId:number) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE lineup_members SET role=${newRole}, member_id=${newMemberId}, lineup_id=${newLineupId} WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
        }
        return result
    }

    public static DeleteLineupRole(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE lineup_members WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static FindAll():Array<object> {
        let result:Array<any> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM lineup_members`)
        } catch (e) {
            console.error("Error "+e)
        }

        return result
    }

    public static FindAllByLineup(lineupID:number):Array<LineupMemberObject> {
        let result:Array<LineupMemberObject> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM lineup_members WHERE lineup_id=${lineupID}`)
        } catch(e) {
            console.error("Error "+e)
        }

        return result
    }


    public static FindAllLineupRoles(lineupID:number):Array<string> {
        let result:Array<string> = []

        try {
            let lineupRoles:Array<LineupMemberObject> = this.FindAllByLineup(lineupID)
            lineupRoles.forEach((obj:LineupMemberObject) => result.push(obj.role))
        } catch(e) {
            console.error("Error: "+ e)
        }

        return result
    }
}
