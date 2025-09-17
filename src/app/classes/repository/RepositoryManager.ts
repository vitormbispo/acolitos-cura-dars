import { AvailabilityRepository } from "./AvailabilityRepository";
import { MemberRepository } from "./MemberRepository";
import { RotationRepository } from "./RotationRepository";
import * as SQLite from "expo-sqlite"

export class RepositoryManager {
    public static database = SQLite.openDatabaseSync("CURADARS")

    public static InitializeRepositories(): void {
        AvailabilityRepository.InitRepository()
        RotationRepository.InitRepository()
        MemberRepository.InitRepository()
        

    }
}