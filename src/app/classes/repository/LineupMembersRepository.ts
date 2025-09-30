import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { RolesRepository } from './RolesRepository'


export type SetMemberObject = {
    id:number,
    role:string,
    member_id:number,
    set_id:number
} 

export class LineupMembersRepository {
    private static database:SQLite.SQLiteDatabase

    public static InitializeDatabase() {
        this.database = RepositoryManager.database
        return this.database.execAsync(`
            PRAGMA foreign_keys=ON,
            CREATE TABLE IF NOT EXISTS set_members (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            role VARCHAR(50),
            member_id INTEGER REFERENCES roles(id),
            set_id INTEGER REFERENCES role_set(id)
            );`)
    }

    public static InsertSetMember(role:string,memberId:number,setId:number) {
        let result:SQLite.SQLiteRunResult
        
        try {
            this.database.runSync(`
                INSERT INTO set_members (role, member_id, set_id) VALUES (
                ${role},
                ${memberId},
                ${setId}
            );`)
        } catch (e) {
            console.error(e)
        }

        return result
    }



    public static FindSetMemberByID(id:number):object {
        let result:object
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM set_members WHERE id=${id};`)
        } catch(e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdateSetRole(id:number, newRole:string, newMemberId:number, newSetId:number) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE set_members SET role=${newRole}, member_id=${newMemberId}, set_id=${newSetId} WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
        }
        return result
    }

    public static DeleteSetRole(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE set_members WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static FindAll():Array<object> {
        let result:Array<any> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM set_members`)
        } catch (e) {
            console.error("Error "+e)
        }

        return result
    }

    public static FindAllBySet(setId:number):Array<SetMemberObject> {
        let result:Array<SetMemberObject> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM set_members WHERE set_id=${setId}`)
        } catch(e) {
            console.error("Error "+e)
        }

        return result
    }

    public static FindAllByRole(role:string):Array<SetMemberObject> {
        let result:Array<SetMemberObject> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM set_members WHERE role="${role}"`)
        } catch(e) {
            console.error("Error "+e)
        }

        return result
    }

    public static FindAllSetRoles(setId:number):Array<string> {
        let result:Array<string> = []

        try {
            let setRoles:Array<SetMemberObject> = this.FindAllBySet(setId)
            setRoles.forEach((obj:SetMemberObject) => result.push(obj.role))
        } catch(e) {
            console.error("Error: "+ e)
        }

        return result
    }
}
