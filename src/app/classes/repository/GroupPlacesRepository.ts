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
        let result = this.database.execAsync(`
            PRAGMA foreign_keys=true;
            CREATE TABLE IF NOT EXISTS group_places (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            place_id INTEGER,
            CONSTRAINT FK_GroupGP FOREIGN KEY (group_id) REFERENCES lineup_group(id),
            CONSTRAINT FK_PlaceGP FOREIGN KEY (place_id) REFERENCES places(id)
        );`).then((_) => { return Promise.resolve(true) }, (e) => { return Promise.reject(e) })
        return result
    }

    public static Insert(group_id: number, place_id: number) {
        let result: SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`
                INSERT INTO group_places (group_id, place_id) VALUES (
                ${group_id},
                ${place_id}
            )`)
        } catch (e) {
            console.error("Error inserting group place: " + e)
        }
        return result
    }

    public static FindByID(id: number): GroupPlacesObject | undefined {
        let result: GroupPlacesObject | undefined

        try {
            result = this.database.getFirstSync(`SELECT * FROM group_places WHERE id=${id}`)
        } catch (e) {
            console.error("Error finding group place by ID: " + e)
        }

        return result
    }

    public static Update(id: number, group_id: number, place_id: number) {
        let result: SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE group_places SET 
                group_id=${group_id},
                place_id=${place_id} 
            WHERE id=${id}`)
        } catch (e) {
            console.error("Error updating group place: " + e)
        }
        return result
    }

    public static Delete(id: number) {
        let result: SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE FROM group_places WHERE id=${id}`)
        } catch (e) {
            console.error("Error deleting group place: " + e)
        }

        return result
    }

    public static FindAllByGroupID(group_id: number): Array<GroupPlacesObject> {
        let result: Array<GroupPlacesObject> = []

        try {
            this.database.getAllSync(`SELECT * FROM group_places WHERE group_id=${group_id}`)
                .forEach((obj: GroupPlacesObject) => result.push(obj))
        } catch (e) {
            console.error("Error finding all group places by group ID: " + e)
        }

        return result
    }

    public static DeleteAllByGroupID(group_id: number): SQLite.SQLiteRunResult{
        let result:SQLite.SQLiteRunResult = null

        try {
            this.database.runSync(`DELETE FROM group_places WHERE group_id=${group_id}`)
        } catch(e) {
            console.error("Error deleting group places by group ID: "+e)
        } 

        return result
    }
}
