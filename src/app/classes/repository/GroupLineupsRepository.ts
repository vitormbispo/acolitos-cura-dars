import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SetRolesRepository } from './SetRolesRepository'


export type GroupLineupObject = {
    id:number,
    key:string
    group_id:number,
    serialized_lineup_id:number
} 

export class GroupLineupsRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS group_lineups (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            serialized_lineup_id INTEGER,

            CONSTRAINT FK_GroupGL FOREIGN KEY (group_id) REFERENCES lineup_group(id) ON DELETE CASCADE,
            CONSTRAINT FK_SerialLineupGL FOREIGN KEY (serialized_lineup_id) REFERENCES serialized_lineups(id) ON DELETE CASCADE
            );`).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    public static Insert(group_id:number,lineup_id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`
                INSERT INTO group_lineups (group_id, serialized_lineup_id) VALUES (
                ${group_id},
                ${lineup_id}
            )`)
        } catch (e) {
            console.error("Error inserting group lineup: "+e)
        }
        return result
    }

    public static FindByID(id:number):GroupLineupObject {
        let result:GroupLineupObject
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM group_lineups WHERE id=${id}`)
        } catch(e) {
            console.error("Error finding group lineup by ID: " + e)
        }

        return result
    }

    public static Update(id:number,group_id:number,lineup_id:number) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE group_lineups SET 
                group_id=${group_id},
                serialized_lineup_id=${lineup_id} 
            WHERE id=${id}`)
        } catch(e) {
            console.error("Error updating group lineup: "+e)
        }
    }

    public static Delete(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE group_lineups WHERE id=${id}`)
        } catch(e) {
            console.error("Error deleting group lineup: "+e)
        }

        return result
    }

    public static FindAllByGroupID(group_id:number):Array<GroupLineupObject> {
        let result:Array<GroupLineupObject> = []

        try {
            this.database.getAllSync(`SELECT * FROM group_lineups WHERE group_id=${group_id}`)
                .forEach((obj:GroupLineupObject) => result.push(obj))
        } catch(e) {
            console.error("Error finding all by group ID: "+e)
        }

        return result
    }

     public static DeleteAllByGroupID(group_id: number): SQLite.SQLiteRunResult{
        let result:SQLite.SQLiteRunResult = null

        try {
            this.database.runSync(`DELETE FROM group_lineups WHERE group_id=${group_id}`)
        } catch(e) {
            console.error("Error deleting group places by group ID: "+e)
        }

        return result
    }
}
