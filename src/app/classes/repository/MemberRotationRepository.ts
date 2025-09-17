import * as SQLite from "expo-sqlite"

export class MemberRotationRepository {
    public static database = SQLite.openDatabaseSync("CURADARS")
    
    public static async InitRepository() {
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS member_rotations (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                role_ava_id INTEGER,
                place_ava_id INTEGER,
                day_ava_id INTEGER,
                FOREIGN KEY (role_ava_id) REFERENCES rotations(id),
                FOREIGN KEY (place_ava_id) REFERENCES rotations(id),
                FOREIGN KEY (day_ava_id) REFERENCES rotations(id)
            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
    }}