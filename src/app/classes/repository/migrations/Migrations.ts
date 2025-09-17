import { RepositoryManager } from "../RepositoryManager";

export class Migrations {
    public static async Migrate(curVersion:number,migration:object) {
        const database = RepositoryManager.database
        const LATEST = Number.parseInt(Object.keys(migration).findLast(()=>true))
        for(let i = curVersion+1; curVersion <= LATEST; i++) {
            try {
                database.execSync(migration[i])
                database.execSync(`PRAGMA user_version=${i}`)
            } catch (e){
                return Promise.reject("Error on executing migration with ID: "+i+": "+e)
            }
        }
        return Promise.resolve(LATEST)
    }
}