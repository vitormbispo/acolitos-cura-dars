import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SetRolesRepository } from './SetRolesRepository'


export type PlaceObject = {
    id:number,
    place:string
} 

export class PlacesRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS places (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            place VARCHAR(100) UNIQUE
            );`).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    public static InsertPlace(place:string) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`
                INSERT INTO places (place) VALUES (
                "${place}"
            )`)
        } catch (e) {
            console.error("Error: "+e)
        }
        return result
    }

    /**
     * Procura por um local no banco de dados. Caso não seja encontrado, uma novo local é inserido.
     * Por fim, retorna o id do local inserido ou encontrado.
     * @param place Nome do local
     * @returns ID do local encontrado ou inserido.
     */
    public static FindOrInsertPlace(place:string) {
        let result:SQLite.SQLiteRunResult
        let placeID:number

        try {
            result = this.database.getFirstSync(`SELECT id FROM places WHERE place="${place}"`)
            if(result == null) {
                placeID = this.InsertPlace(place).lastInsertRowId
                console.log("Place not found, created with id: "+placeID)
                
            } else {
                placeID = result["id"]
                console.log("Place has been found with ID: "+placeID)
            }
        } catch (e) {
            console.error("Error: "+e)
        }
        return placeID
    }

    public static FindPlaceByID(id:number):PlaceObject {
        let result:PlaceObject
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM places WHERE id=${id}`)
        } catch(e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdatePlace(id:number,newPlace:string) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE places SET place="${newPlace}" WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }
    }

    public static DeletePlace(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE places WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static DeletePlaceByName(place:string) {
        let result:SQLite.SQLiteRunResult

        try {
            let placeID = this.database.getFirstSync(`SELECT id FROM places WHERE place="${place}"`)["id"]
            result = this.database.runSync(`DELETE places WHERE place=${place}`)
            SetRolesRepository.DeleteByRoleID(placeID)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static FindAllPlaces():Array<string> {
        let result:Array<string> = []

        try {
            this.database.getAllSync(`SELECT * FROM places`).forEach((place:PlaceObject) => result.push(place.place))
        } catch (e) {
            console.error("Error "+e)
        }

        return result
    }

    public static async InsertPlaceAsync(place: string): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`
                INSERT INTO places (place) VALUES (
                "${place}"
            )`);
        } catch (e: any) {
            console.error("Error #" + e.code + ":" + e);
            return undefined;
        }
    }

    public static async FindPlaceByIDAsync(id: number): Promise<PlaceObject | undefined> {
        try {
            const result: PlaceObject = await this.database.getFirstAsync(`SELECT * FROM places WHERE id=${id}`);
            return result;
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async UpdatePlaceAsync(id: number, newPlace: string): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`UPDATE places SET place="${newPlace}" WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async DeletePlaceAsync(id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`DELETE FROM places WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async FindAllPlacesAsync(): Promise<Array<string>> {
        const result: Array<string> = [];
        try {
            const places = await this.database.getAllAsync(`SELECT * FROM places`);
            places.forEach((place: PlaceObject) => result.push(place.place));
        } catch (e) {
            console.error("Error " + e);
        }
        return result;
    }
}
