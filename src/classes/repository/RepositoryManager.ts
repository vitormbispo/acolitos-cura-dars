import * as SQLite from "expo-sqlite"

export class RepositoryManager {
    public static database = SQLite.openDatabaseSync("CURADARS")
}