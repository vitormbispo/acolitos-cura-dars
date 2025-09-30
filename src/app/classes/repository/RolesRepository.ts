import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { SetRolesRepository } from './SetRolesRepository'


export type RoleObject = {
    id:number,
    role:string
} 

export class RolesRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS roles (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            role VARCHAR(100) UNIQUE
            );`).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    public static InsertRole(role:string) {
        let result:SQLite.SQLiteRunResult
        let id = null
        try {
            result = this.database.runSync(`
                INSERT INTO roles (role) VALUES (
                "${role}"
            )`)
        } catch (e) {
            console.error("Error: "+e)
        }
        return result
    }

    /**
     * Procura por uma função no banco de dados. Caso não seja encontrada, uma nova função é inserida.
     * Por fim, retorna o id da função inserida ou encontrada.
     * @param role Nome da função
     * @returns ID da função encontrada ou inserida.
     */
    public static FindOrInsertRole(role:string) {
        let result:SQLite.SQLiteRunResult
        let roleId:number

        try {
            result = this.database.getFirstSync(`SELECT id FROM roles WHERE role="${role}"`)
            if(result == null) {
                roleId = this.InsertRole(role).lastInsertRowId
                console.log("Role not found, created with id: "+roleId)
                
            } else {
                roleId = result["id"]
                console.log("Role has been found with ID: "+roleId)
            }

            //roleId = result == null ? 
                //this.InsertRole(role).lastInsertRowId : 
                //result.lastInsertRowId

        } catch (e) {
            console.error("Error: "+e)
        }
        return roleId
    }

    public static FindRoleByID(id:number):RoleObject {
        let result:RoleObject
        
        try {
            result = this.database.getFirstSync(`SELECT * FROM roles WHERE id=${id}`)
        } catch(e) {
            console.error("Error: " + e)
        }

        return result
    }

    public static UpdateRole(id:number,newRole:string) {
        let result:SQLite.SQLiteRunResult
        try {
            result = this.database.runSync(`UPDATE roles SET role="${newRole}" WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }
    }

    public static DeleteRole(id:number) {
        let result:SQLite.SQLiteRunResult

        try {
            result = this.database.runSync(`DELETE roles WHERE id=${id}`)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static DeleteRoleByName(role:string) {
        let result:SQLite.SQLiteRunResult

        try {
            let roleId = this.database.getFirstSync(`SELECT id FROM roles WHERE role="${role}"`)["id"]
            result = this.database.runSync(`DELETE roles WHERE role=${role}`)
            SetRolesRepository.DeleteSetRoleByRoleID(roleId)
        } catch(e) {
            console.error("Error: "+e)
        }

        return result
    }

    public static FindAllRoles():Array<string> {
        let result:Array<any> = []

        try {
            this.database.getAllSync(`SELECT * FROM roles`).forEach((role:RoleObject) => result.push(role.role))
        } catch (e) {
            console.error("Error "+e)
        }

        return result
    }

    public static async InsertRoleAsync(role: string): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return this.database.runAsync(`
                INSERT INTO roles (role) VALUES (
                "${role}"
            )`);
        } catch (e: any) {
            console.error("Error #" + e.code + ":" + e);
            return undefined;
        }
    }

    public static async FindRoleByIDAsync(id: number): Promise<string | undefined> {
        try {
            const result:RoleObject = await this.database.getFirstAsync(`SELECT * FROM roles WHERE id=${id}`);
            return result?.role;
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async UpdateRoleAsync(id: number, newRole: string): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`UPDATE roles SET role="${newRole}" WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async DeleteRoleAsync(id: number): Promise<SQLite.SQLiteRunResult | undefined> {
        try {
            return await this.database.runAsync(`DELETE FROM roles WHERE id=${id}`);
        } catch (e) {
            console.error("Error: " + e);
            return undefined;
        }
    }

    public static async FindAllRolesAsync(): Promise<Array<string>> {
        const result: Array<string> = [];
        try {
            const roles = await this.database.getAllAsync(`SELECT * FROM roles`);
            roles.forEach((role: RoleObject) => result.push(role.role));
        } catch (e) {
            console.error("Error " + e);
        }
        return result;
    }
}
