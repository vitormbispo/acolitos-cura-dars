import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SetRolesRepository } from './SetRolesRepository'


export type GroupLineupObject = {
    id:number,
    key:string
    group_id:number,
    lineup_id:number
} 

export class GroupLineupsRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS group_lineups (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            key VARCHAR(20),
            group_id INTEGER,
            lineup_id INTEGER
            );`).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    public static InsertGroupLineup(key:string,group_id:number,lineup_id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`
                INSERT INTO group_lineups (key, group_id, lineup_id) VALUES (
                "${key}",
                ${group_id},
                ${lineup_id}
            )`)
        } catch (e) {
            console.error("Error: "+e)
        }
        return result
    }

    public static FindByID(id:number):GroupLineupObject {
        let result:GroupLineupObject
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM group_lineups WHERE id=${id}`)
        } catch(e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdateGroup(id:number,key:string,group_id:number,lineup_id:number) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE group_lineups SET 
                key="${key}",
                group_id=${group_id},
                lineup_id=${lineup_id} 
            WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }
    }

    public static DeleteGroupLineup(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE group_lineups WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static FindAllByGroupID(group_id:number):Array<GroupLineupObject> {
        let result:Array<GroupLineupObject> = []

        try {
            this.database.getAllSync(`SELECT * FROM group_lineups WHERE group_id=${group_id}`)
                .forEach((obj:GroupLineupObject) => result.push(obj))
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static async InsertGroupLineupAsync(key: string, group_id: number, lineup_id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`
                INSERT INTO group_lineups (key, group_id, lineup_id) VALUES (
                "${key}",
                ${group_id},
                ${lineup_id}
            )`);
        } catch (e: any) {
            console.error("Error #" + e.code + ":" + e);
            return undefined;
        }
    }

    public static async FindByIDAsync(id: number): Promise<GroupLineupObject | undefined> {
        try {
            const result: GroupLineupObject = await this.database.getFirstAsync(`SELECT * FROM group_lineups WHERE id=${id}`);
            return result;
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async UpdateGroupAsync(id: number, key: string, group_id: number, lineup_id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`UPDATE group_lineups SET 
                key="${key}",
                group_id=${group_id},
                lineup_id=${lineup_id} 
            WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async DeleteGroupLineupAsync(id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`DELETE FROM group_lineups WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async FindAllByGroupIDAsync(group_id: number): Promise<Array<GroupLineupObject>> {
        const result: Array<GroupLineupObject> = [];
        try {
            const lineups = await this.database.getAllAsync(`SELECT * FROM group_lineups WHERE group_id=${group_id}`);
            lineups.forEach((obj: GroupLineupObject) => result.push(obj));
        } catch (e) {
            console.error("Error " + e);
        }
        return result;
    }
}
