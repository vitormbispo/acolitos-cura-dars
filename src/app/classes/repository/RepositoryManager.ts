import { Rotation } from "../members/Rotation";
import { AvailabilityRepository } from "./AvailabilityRepository";
import { MemberRepository } from "./MemberRepository";
import { RotationRepository } from "./RotationRepository";

export class RepositoryManager {
    public static InitializeRepositories(): void {
        AvailabilityRepository.InitRepository()
        RotationRepository.InitRepository()
        MemberRepository.InitRepository()
        
        
    }
}