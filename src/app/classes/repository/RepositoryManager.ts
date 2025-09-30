import { MemberRepository } from "./MemberRepository";
import * as SQLite from "expo-sqlite"

export class RepositoryManager {
    public static database = SQLite.openDatabaseSync("CURADARS")

    public static InitializeRepositories(): void {
        MemberRepository.InitRepository()
        

    }
}