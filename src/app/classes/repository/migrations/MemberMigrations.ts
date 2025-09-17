import { RepositoryManager } from "../RepositoryManager"

export class MemberMigration {
    public static readonly LATEST_MIGRATION = 1
    private static readonly migrations:object = {
        0:"",
        1:
            `ALTER TABLE members ADD COLUMN memberAvailability;
             ALTER TABLE members ADD FOREIGN KEY (memberAvailability) REFERENCES memberAvailability(id);
            `}
    
    public static async Migrate(curVersion:number) {
        const database = RepositoryManager.database
        for(let i = curVersion+1; i <= this.LATEST_MIGRATION; i++) {
            database.execSync(this.migrations[i])
            database.execSync(`PRAGMA user_version=${i}`)
        }
    }
}