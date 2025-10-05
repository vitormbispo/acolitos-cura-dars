import * as SQLite from 'expo-sqlite'
import { RepositoryManager } from './RepositoryManager'
import { MemberType } from '../MemberData'
import { SetRolesRepository } from './SetRolesRepository'
import { RolesRepository } from './RolesRepository'
import { RoleSet } from '../roles/RoleSet'
import { Role } from 'react-native'

type RoleSetObject = {
    id:number,
    name:string,
    memberType:number,
    size:number,
    isDefault:number
}

export class RoleSetRepository {
    
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = RepositoryManager.database
        let result = this.database.execAsync(`CREATE TABLE IF NOT EXISTS role_set(
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50),
            memberType INTEGER,
            size INTEGER,
            isDefault INTEGER
            );
            
            `).then((_) => {return Promise.resolve(true)}, (e) => {return Promise.reject(e)})
        return result
    }

    // CREATE
    public static InsertRoleSet(roleSet:RoleSet):SQLite.SQLiteRunResult {
        let result:SQLite.SQLiteRunResult = null
        let setId:number

        try {
            result = this.database.runSync(`INSERT INTO role_set (name,memberType,size,isDefault) VALUES (
                "${roleSet.name}",
                ${roleSet.type},
                ${roleSet.size},
                ${roleSet.isDefault ? 1:0}
                );`)
            setId = result.lastInsertRowId
            roleSet.id = setId

            roleSet.set.forEach(role => {
                let roleId = RolesRepository.FindOrInsertRole(role)
                SetRolesRepository.InsertSetRole(roleId,setId)
            })
        } catch(e) {
            console.error("Error: "+e)
        }

        return result        
    }


    // READ
    public static FindRoleSetByID(id:number) {
        let result:RoleSetObject = null

        try {
            result = this.database.getFirstSync(`SELECT * FROM role_set WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
            return null
        }
        
        return this.BuildRoleset(result) 
    }

    public static FindAll() {
        let result:Array<RoleSetObject> = null

        try {
            result = this.database.getAllSync(`SELECT * FROM role_set;`)
        } catch(e) {
            console.error("Error: "+e)
            return null
        }
        
        return this.BuildAll(result)
    }

    //UPDATE
    public static UpdateRoleSet(roleset:RoleSet): SQLite.SQLiteRunResult{
        let result:SQLite.SQLiteRunResult = null

        try {
            result = this.database.runSync(`UPDATE role_set SET
                name="${roleset.name}",
                memberType=${roleset.type},
                size=${roleset.size},
                isDefault=${roleset.isDefault ? 1:0}
                WHERE id=${roleset.id}`)
            SetRolesRepository.DeleteBySetID(roleset.id)
            roleset.set.forEach((role) => {
                let roleId = RolesRepository.FindOrInsertRole(role)
                SetRolesRepository.InsertSetRole(roleId,roleset.id)
            })
        } catch (e) {
            console.error("Error Updating RoleSet: "+ e)
        }
        return result
    }


    // DELETE
    public static DeleteRoleSetByID(id:number):SQLite.SQLiteRunResult {
        let result:SQLite.SQLiteRunResult = null

        try {
            result = this.database.runSync(`DELETE FROM role_set WHERE id=${id};`)
        } catch(e) {
            console.error("Error: "+e)
        }
        
        return result   
    }

    public static DeleteAll():SQLite.SQLiteRunResult {
        let result:SQLite.SQLiteRunResult = null

        try {
            SetRolesRepository.DeleteAll()
            result = this.database.runSync(`DELETE FROM role_set`)
            console.log(`DELETED ALL set_roles. ${result.changes} rows affected.`)    
        } catch(e) {
            console.error("Error deleting all RoleSets: "+e)
        }

        return result
    }

    private static BuildAll(objects:Array<RoleSetObject>):Array<RoleSet> {
        let builded:Array<RoleSet> = []
        objects.forEach((obj:RoleSetObject) => builded.push(this.BuildRoleset(obj)))
        return builded
    }

    private static BuildRoleset(obj:RoleSetObject):RoleSet {
        let newRoleSet:RoleSet = new RoleSet(
            obj.name,
            obj.memberType as MemberType,
            SetRolesRepository.FindAllRolesFromSet(obj.id),
            obj.isDefault == 1
        )
        newRoleSet.id = obj.id
        return newRoleSet
    }
}