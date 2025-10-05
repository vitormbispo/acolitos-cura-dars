import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SerializedLineup } from '../lineups/SerializedLineup'


export type SerializedLineupObject = {
    id:number,
    name:string,
    place:string,
    set:string
}

export class SerializedLineupRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database

        this.database.execAsync(`CREATE TABLE IF NOT EXISTS serialized_lineups(
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50),
                place VARCHAR(100),
                set TEXT
            );`)
        
    }

    public static Insert(lineup:SerializedLineup) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`INSERT INTO serialized_lineups (name,place,set) VALUES (
                "${lineup.name}",
                "${lineup.place}",
                "${JSON.stringify(lineup.line)}"
                )`)
        } catch(e) {
            console.error("Error inserting serialized lineup: "+e)
        }

        return result
    }

    public static FindByID(id:number):SerializedLineup {
        let result:SerializedLineupObject

        try {
            result = this.database.getFirstSync(`SELECT * FROM serialized_lineups WHERE id=${id}`)
        } catch(e) {
            console.error("Error finding serialized lineup with id: "+id+": "+e)
            return null
        }

        return this.BuildSerializedLineup(result)
    }

    public static FindAll(id:number):Array<SerializedLineup> {
        let result:Array<SerializedLineupObject>

        try {
            result = this.database.getAllSync(`SELECT * FROM serialized_lineups`)
        } catch(e) {
            console.error("Error finding all serialized lineups: "+e)
            return null
        }

        return this.BuildAll(result)
    }

    public static Update(lineup: SerializedLineup) {
        let result: SQLite.SQLiteRunResult;

        try {
            result = this.database.runSync(
                `UPDATE serialized_lineups SET 
                    name = "${lineup.name}", 
                    place = "${lineup.place}", 
                    set = "${JSON.stringify(lineup.line)}"
                WHERE id = ${lineup.id}`
            );
        } catch (e) {
            console.error("Error updating serialized lineup: " + e);
            return null;
        }

        return result;
    }

    public static Delete(id: number) {
        let result: SQLite.SQLiteRunResult;

        try {
            result = this.database.runSync(
                `DELETE FROM serialized_lineups WHERE id = ${id}`
            );
        } catch (e) {
            console.error("Error deleting serialized lineup with id: " + id + ": " + e);
            return null;
        }

        return result;
    }

    private static BuildSerializedLineup(obj:SerializedLineupObject):SerializedLineup {
        const serialized = new SerializedLineup(obj.name,obj.place,JSON.parse(obj.set))
        serialized.id = obj.id
        serialized.members = Object.values(serialized.line)

        return serialized
    }

    private static BuildAll(objects:Array<SerializedLineupObject>):Array<SerializedLineup> {
        const result:Array<SerializedLineup> = []
        objects.forEach((obj) => result.push(this.BuildSerializedLineup(obj)))
        return result
    }
}