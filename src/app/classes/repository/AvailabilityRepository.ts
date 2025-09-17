import * as SQLite from "expo-sqlite"
import { Rotation, RotationTypes } from "../members/Rotation"
import { MemberType } from "../MemberData"
import { Availability, AvailabilityTypes } from "../members/availability/Availability"
import { DayAvailability } from "../members/availability/DayAvailability"
import { PlaceAvailability } from "../members/availability/PlaceAvailability"


type AvailabilityObject = {
    id:number
    memberType:MemberType
    availabilityType:AvailabilityTypes
    memberId:number
    map:string
}

export class AvailabilityRepository {
    
    public static database = SQLite.openDatabaseSync("CURADARS")
    
    public static async InitRepository() {
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS availabilities (
	            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                memberType INTEGER,
                availabilityType INTEGER,
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
    public static async InsertAvailability(availability:Availability) {
        this.database.runAsync(`
            INSERT INTO availabilities (availabilityType,memberType,map,memberId) VALUES (
                ${availability.getAvailabilityType()},    
                ${availability.getMemberType()},
                "${JSON.stringify(availability.getMap())}",
                ${availability.getMemberId()}
            )
            `).then(()=>{console.log("Success")}).catch((e)=>{"Error: "+e})
    }

    //READ
    public static async FindAvailabilityById(id:number) {
        const row:AvailabilityObject = await this.database.getFirstAsync(`SELECT FROM availabilities WHERE id=${id}`)
        if(row == null) return null
        
        let foundAvailability:Availability = this.BuildAvailability(row)
        return foundAvailability
    }

    public static async FindAllRotations():Promise<Array<Availability>> {
        let rows:Array<AvailabilityObject> = await this.database.getAllAsync(`SELECT * FROM rotations`)
        let rotations:Array<Availability> = this.BuildAllRotations(rows)
        return Promise.resolve(rotations)
    }

    public static FindAllByRotationType(type:RotationTypes):Array<Availability> {
        let rows:Array<AvailabilityObject> = this.database.getAllSync(`SELECT * FROM rotations WHERE rotationType=${type}`)
        if(rows == null) return null
        let found:Array<Availability> = this.BuildAllRotations(rows)
        return found
    }

    public static FindAllByMemberType(type:MemberType):Array<Availability> {
        let rows:Array<AvailabilityObject> = this.database.getAllSync(`SELECT * FROM rotations WHERE memberType=${type}`)
        if(rows == null) return null
        let found:Array<Availability> = this.BuildAllRotations(rows)
        return found
    }


    // UPDATE
    public static async UpdateRotation(rotation:Rotation) {
        const result = await this.database.runAsync(`
            UPDATE rotations SET 
            type = ${rotation.getMemberType()}, 
            map = "${JSON.stringify(rotation.getMap())}"
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
    private static BuildAvailability(obj:AvailabilityObject):Availability {
        const type:AvailabilityTypes = obj.availabilityType
        let newAvailability:Availability

        switch(type) {
            case AvailabilityTypes.DAYS: newAvailability = new DayAvailability()
            case AvailabilityTypes.PLACES: newAvailability = new PlaceAvailability()
        }

        newAvailability.setId(obj.id)
        newAvailability.setMemberType(obj.memberType)
        newAvailability.setAvailabilityType(obj.availabilityType)
        newAvailability.setMemberId(obj.memberId)
        newAvailability.setMap(JSON.parse(obj.map))
        newAvailability.updateMap()
        return newAvailability
    }

    private static BuildAllRotations(availabilities:Array<AvailabilityObject>) {
        let builded:Array<Availability> = []
        availabilities.forEach(availability => builded.push(this.BuildAvailability(availability)))
        return builded
    }
}