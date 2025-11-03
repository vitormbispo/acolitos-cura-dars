import * as SQLite from 'expo-sqlite'
import { Lineup } from '../lineups/Lineup'
import { GroupPlacesRepository } from './GroupPlacesRepository'
import { PlacesRepository } from './PlacesRespository'
import { LineupGroup } from '../lineups/LineupGroup'
import { LineupRepository } from './LineupRepository'
import { GroupLineupObject, GroupLineupsRepository } from './GroupLineupsRepository'
import { SerializedLineupRepository } from './SerializedLineupRepository'
import { MemberType } from '../members/MemberType'
import { LineupConversion } from '../lineups/LineupConversion'

type LineupGroupObject = {
    id:number,
    name:string,
    type:number
}

export class LineupGroupRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = await SQLite.openDatabaseAsync("CURADARS")
        console.log("Exec")
        this.database.execAsync(`
            CREATE TABLE IF NOT EXISTS lineup_group (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50),
                type INTEGER,
                map TEXT
            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
    }

    public static Insert(group:LineupGroup) {
        let result:SQLite.SQLiteRunResult = null

        try {
            result = this.database.runSync(`INSERT INTO lineup_group (name,type,map) VALUES ( 
                '${group.name}',
                ${group.type},
                '${JSON.stringify(group.monthLineupsMap)}'
            )`)
            group.id = result.lastInsertRowId
            
            group.places.forEach((place) => {
                GroupPlacesRepository.Insert(group.id,PlacesRepository.FindOrInsertPlace(place))
            })

            group.lineups.forEach((line) => {
                let line_id = SerializedLineupRepository.Insert(LineupConversion.Serialize(line)).lastInsertRowId
                GroupLineupsRepository.Insert(group.id,line_id)
            })

        } catch(e) {
            console.error("Error inserting lineup group: "+e)
        }

        return result
    }
    
    public static Update(group:LineupGroup) {
        let result:SQLite.SQLiteRunResult = null

        try {
            result = this.database.runSync(`UPDATE lineup_group SET
                name='${group.name}',
                type=${group.type}
                WHERE id=${group.id}
            `)
            
            GroupPlacesRepository.DeleteAllByGroupID(group.id)
            group.places.forEach((place) => {
                GroupPlacesRepository.Insert(group.id,PlacesRepository.FindOrInsertPlace(place))
            })

            GroupLineupsRepository.DeleteAllByGroupID(group.id)
            group.lineups.forEach((line) => {
                let line_id = SerializedLineupRepository.Insert(LineupConversion.Serialize(line)).lastInsertRowId
                GroupLineupsRepository.Insert(group.id,line_id)
            })

        } catch(e) {
            console.error("Error updating lineup group: "+e)
        }

        return result
    }

    public static FindLineupGroupByID(id:number):LineupGroup {
        let result:LineupGroupObject = null

        try{
            result = this.database.getFirstSync(`SELECT * FROM lineup_group WHERE id=${id}`)

        } catch(e) {
            console.error("Error finding lineup group by ID: "+e)
            return null
        }
        
        return this.BuildLineupGroup(result)
    }

    public static FindAllLineupGroups():Array<LineupGroup> {
        let result:Array<LineupGroupObject> = []

        try{
            result = this.database.getAllSync(`SELECT * FROM lineup_group`)

        } catch(e) {
            console.error("Error finding lineup groups: "+e)
            return []
        }
        
        return this.BuildAll(result)
    }

    public static GetGroupPlaces(id:number):Array<string> {
        let result:Array<string> = []
        
        try {
            const groupPlaces = GroupPlacesRepository.FindAllByGroupID(id)
            groupPlaces.forEach((group) => { 
                let place:string = PlacesRepository.FindPlaceByID(group.place_id).place
                result.push(place == "null" ? null : place) 
            })
        } catch(e) {
            console.error("Error getting group places: "+e)
        }
        return result
    }

    public static GetGroupLineups(id:number):Array<Lineup> {
        let result:Array<Lineup> = []

        try {
            const lineups = GroupLineupsRepository.FindAllByGroupID(id)
            lineups.forEach((line) => result.push(LineupRepository.FindLineupByID(line.serialized_lineup_id)))

        } catch(e) {
            console.error("Error getting group lineups: "+ e)
        }

        return result
    }

    public static Delete(id:number):SQLite.SQLiteRunResult {
        let result:SQLite.SQLiteRunResult = null

        try {
            result = this.database.runSync(`DELETE FROM lineup_group WHERE id=${id}`)
            
        } catch(e) {
            console.error("Error deleting lineup group: "+e)
        }

        return result
    }

    public static BuildLineupGroup(obj:LineupGroupObject): LineupGroup {
        const group = new LineupGroup(obj.name)
        group.id = obj.id
        group.name = obj.name
        group.type = obj.type as MemberType
        group.places = this.GetGroupPlaces(obj.id)
        
        const lineups:Array<GroupLineupObject> = GroupLineupsRepository.FindAllByGroupID(group.id)
        lineups.forEach((line) => {
            const lineup = SerializedLineupRepository.FindByID(line.serialized_lineup_id)
            group.monthLineupsMap[lineup.weekend] = lineup
            group.lineups.push(LineupConversion.Deserialize(lineup))
        })
        return group
        
    }

    public static BuildAll(objs:Array<LineupGroupObject>): Array<LineupGroup> {
        let result:Array<LineupGroup> = []

        objs.forEach((obj) => result.push(this.BuildLineupGroup(obj)))
        return result
    }
}

