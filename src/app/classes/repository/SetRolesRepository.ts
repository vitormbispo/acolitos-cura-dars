import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { RolesRepository } from './RolesRepository'


export type SetRoleObject = {
    id:number,
    role_id:number,
    set_id:number
} 

export class SetRolesRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = await this.database.execAsync(`
            CREATE TABLE IF NOT EXISTS set_roles (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            role_id INTEGER,
            set_id INTEGER
            );`).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    public static InsertSetRole(roleId:number,setId:number) {
        let result:SQLite.SQLiteRunResult
        console.log("Role ID "+roleId)
        console.log("Set ID"+setId)

        try {
            this.database.runSync(`
                INSERT INTO set_roles (role_id, set_id) VALUES (
                ${roleId},
                ${setId}
            );`)
        } catch (e) {
            console.error("Insert Set role error: " + e)
        }

        return result
    }

    public static FindSetRoleByID(id:number):object {
        let result:object
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM set_roles WHERE id=${id};`)
        } catch(e) {
            console.error("Set Role Error: " + e)
        }

        return result
    }

    public static UpdateSetRole(id:number,newRoleId:number,newSetId:number) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE set_roles SET role_id=${newRoleId}, set_id=${newSetId} WHERE id=${id};`)
        } catch(e) {
            console.error("Update Set Role Error: "+e)
        }
        return result
    }

    public static DeleteSetRole(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE set_roles WHERE id=${id};`)
            console.log(`DELETED set_roles by id. ${result.changes} rows affected.`)
        } catch(e) {
            console.error("Set Role Error: "+e)
        }

        return result
    }

    public static DeleteByRoleID(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE set_roles WHERE role_id=${id};`)
            console.log(`DELETED set_roles by role_id. ${result.changes} rows affected.`)
        } catch(e) {
            console.error("Set Role Error: "+e)
        }

        return result
    }

    public static DeleteBySetID(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE set_roles WHERE set_id=${id};`)
            console.log(`DELETED set_roles by set_id. ${result.changes} rows affected.`)
        } catch(e) {
            console.error("Delete Set Role Error: "+e)
        }

        return result
    }

    public static DeleteByRoleAndSetID(role_id:number,set_id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE set_roles WHERE role_id=${role_id} AND set_id=${set_id};`)
            console.log(`DELETED set_roles by set_id. ${result.changes} rows affected.`)
        } catch(e) {
            console.error("Delete By Roleset ID Set Role Error: "+e)
        }

        return result
    }

    public static DeleteAll() {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE FROM set_roles;`)
            console.log(`DELETED ALL set_roles. ${result.changes} rows affected.`)
        } catch(e) {
            console.error("Delete all set roles error: "+e)
        }

        return result
    }

    public static FindAll():Array<object> {
        let result:Array<any> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM roles`)
        } catch (e) {
            console.error("Set Role Error "+e)
        }

        return result
    }

    public static FindAllBySet(setId:number):Array<SetRoleObject> {
        let result:Array<SetRoleObject> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM set_roles WHERE set_id=${setId}`)
        } catch(e) {
            console.error("Find All Set Role Error "+e)
        }

        return result
    }

    public static FindAllByRole(roleId:number):Array<SetRoleObject> {
        let result:Array<SetRoleObject> = []

        try {
            result = this.database.getAllSync(`SELECT * FROM roles WHERE role_id=${roleId}`)
        } catch(e) {
            console.error("Set Role Error "+e)
        }

        return result
    }

    public static FindAllRolesFromSet(setId:number):Array<string> {
        let result:Array<string> = []

        try {
            let setRoles:Array<SetRoleObject> = this.FindAllBySet(setId)
            setRoles.forEach((obj:SetRoleObject) => result.push(RolesRepository.FindRoleByID(obj.role_id).role))
        } catch(e) {
            console.error("Set Role Error: "+ e)
        }

        return result
    }
}
