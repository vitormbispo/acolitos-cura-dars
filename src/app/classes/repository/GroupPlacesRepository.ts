import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SetRolesRepository } from './SetRolesRepository'


export type GroupPlacesObject = {
    id:number,
    group_id:number,
    place_id:number
} 

export class GroupPlacesRepository {
    private static database: SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS group_places (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            place_id INTEGER
        );`).then((_) => { return Promise.resolve(true) }, (e) => { return Promise.reject(e) })
        return result
    }

    public static InsertGroupPlace(group_id: number, place_id: number) {
        let result: SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`
                INSERT INTO group_places (group_id, place_id) VALUES (
                ${group_id},
                ${place_id}
            )`)
        } catch (e) {
            console.error("Error: " + e)
        }
        return result
    }

    public static FindByID(id: number): GroupPlacesObject | undefined {
        let result: GroupPlacesObject | undefined

        try {
            result = this.database.getFirstSync(`SELECT * FROM group_places WHERE id=${id}`)
        } catch (e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdateGroupPlace(id: number, group_id: number, place_id: number) {
        let result: SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE group_places SET 
                group_id=${group_id},
                place_id=${place_id} 
            WHERE id=${id}`)
        } catch (e) {
            console.error("Error: " + e)
        }
        return result
    }

    public static DeleteGroupPlace(id: number) {
        let result: SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE FROM group_places WHERE id=${id}`)
        } catch (e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static FindAllByGroupID(group_id: number): Array<GroupPlacesObject> {
        let result: Array<GroupPlacesObject> = []

        try {
            this.database.getAllSync(`SELECT * FROM group_places WHERE group_id=${group_id}`)
                .forEach((obj: GroupPlacesObject) => result.push(obj))
        } catch (e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static async InsertGroupPlaceAsync(group_id: number, place_id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`
                INSERT INTO group_places (group_id, place_id) VALUES (
                ${group_id},
                ${place_id}
            )`);
        } catch (e: any) {
            console.error("Error #" + e.code + ":" + e);
            return undefined;
        }
    }

    public static async FindByIDAsync(id: number): Promise<GroupPlacesObject | undefined> {
        try {
            const result: GroupPlacesObject = await this.database.getFirstAsync(`SELECT * FROM group_places WHERE id=${id}`);
            return result;
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async UpdateGroupPlaceAsync(id: number, group_id: number, place_id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`UPDATE group_places SET 
                group_id=${group_id},
                place_id=${place_id} 
            WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async DeleteGroupPlaceAsync(id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`DELETE FROM group_places WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async FindAllByGroupIDAsync(group_id: number): Promise<Array<GroupPlacesObject>> {
        const result: Array<GroupPlacesObject> = [];
        try {
            const places = await this.database.getAllAsync(`SELECT * FROM group_places WHERE group_id=${group_id}`);
            places.forEach((obj: GroupPlacesObject) => result.push(obj));
        } catch (e) {
            console.error("Error " + e);
        }
        return result;
    }
}
