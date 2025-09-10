import * as SQLite from "expo-sqlite"
import { Rotation, RotationTypes } from "../members/Rotation"
import { DayRotation } from "../members/DayRotation"
import { RoleRotation } from "../members/RoleRotation"
import { MemberType } from "../MemberData"
import { MemberObject, MemberRepository } from "./MemberRepository"
import { Member } from "../members/Member"


type RotationObject = {
    id:number
    memberType:MemberType
    rotationType:RotationTypes
    memberId:number
    map:string
}

export class RotationRepository {
    
    public static database = SQLite.openDatabaseSync("CURADARS")
    
    public static async InitRepository() {
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS rotations (
	            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                memberType INTEGER,
                rotationType INTEGER,
                map TEXT,
                memberId INTEGER,
                FOREIGN KEY (memberId) REFERENCES members(id)
            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
    }

    // CREATE
    public static async InsertRotation(rotation:Rotation) {
        return this.database.runAsync(`
            INSERT INTO rotations (rotationType,memberType,map,memberId) VALUES (
                ${rotation.getRotationType()},
                ${rotation.getMemberType()},
                "${JSON.stringify(rotation.getMap())}",
                ${rotation.getMemberRef().getId()}
            )
            `)
    }

    //READ
    public static async FindRotationById(id:number):Promise<Rotation> {
        const row:RotationObject = await this.database.getFirstAsync(`SELECT FROM rotations WHERE id=${id}`)
        if(row == null) return Promise.reject(`Rotation with id:${id} not found.`)
        
        let foundRotation:Rotation = this.BuildRotation(row)
        return Promise.resolve(foundRotation)
    }

    public static async FindAllRotations():Promise<Array<Rotation>> {
        let rows:Array<RotationObject> = await this.database.getAllAsync(`SELECT * FROM rotations`)
        let rotations:Array<Rotation> = this.BuildAllRotations(rows)
        return Promise.resolve(rotations)
    }

    public static async FindAllByRotationType(type:RotationTypes):Promise<Array<Rotation>> {
        let rows:Array<RotationObject> = this.database.getAllSync(`SELECT * FROM rotations WHERE rotationType=${type}`)
        if(rows == null) return null
        let found:Array<Rotation> = this.BuildAllRotations(rows)
        return Promise.resolve(found)
    }

    public static async FindAllByMemberType(type:MemberType):Promise<Array<Rotation>> {
        let rows:Array<RotationObject> = this.database.getAllSync(`SELECT * FROM rotations WHERE memberType=${type}`)
        if(rows == null) return null
        let found:Array<Rotation> = this.BuildAllRotations(rows)
        return Promise.resolve(found)
    }


    // UPDATE
    public static async UpdateRotation(rotation:Rotation) {
        const result = await this.database.runAsync(`
            UPDATE rotations SET 
            rotationType = ${rotation.getRotationType()},
            memberType = ${rotation.getMemberType()}, 
            map = "${JSON.stringify(rotation.getMap())}",
            memberId = ${rotation.getMemberRef().getId()}
            WHERE id = ${rotation.getId()}
            `)
        console.log(`UPDATED rotation with id: ${rotation.getId()}. ${result.changes} row(s) affected.`)
    }


    // DELETE
    public static async DeleteRotationById(id:number) {
        const result = await this.database.runAsync(`DELETE FROM rotations WHERE id=${id}`)
        console.log(`DELETED rotation with id: ${id}. ${result.changes} row(s) affected.`)
    }

    public static async DeleteAll() {
        const result = await this.database.runAsync(`DELETE FROM rotations`)
        console.log(`DELETED ALL ROTATIONS. ${result.changes} row(s) affected.`)
    }

    // Funções auxiliares
    private static BuildRotation(obj:RotationObject):Rotation {
        const type:RotationTypes = obj.rotationType
        let newRotation:Rotation
        let foundMember:Member = MemberRepository.FindMemberById(obj.memberId)
        if(foundMember == null) throw "Error: Member not found!"

        switch(type) {
            case RotationTypes.DAYS: newRotation = new DayRotation(foundMember)
            case RotationTypes.ROLES: newRotation = new RoleRotation(foundMember)
        }

        newRotation.setId(obj.id)
        newRotation.setMemberType(obj.memberType)
        newRotation.setRotationType(obj.rotationType)
        newRotation.setMap(JSON.parse(obj.map))
        newRotation.updateMap()
        return newRotation
    }

    private static BuildAllRotations(rotations:Array<RotationObject>) {
        let builded:Array<Rotation> = []
        rotations.forEach(rotation => builded.push(this.BuildRotation(rotation)))
        return builded
    }
}