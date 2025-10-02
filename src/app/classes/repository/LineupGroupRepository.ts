import * as SQLite from 'expo-sqlite'
import { Lineup } from '../lineups/Lineup'
import { LineupMemberObject, LineupMembersRepository } from './LineupMembersRepository'
import { RoleSetRepository } from './RoleSetRepository'
import { MemberData } from '../MemberData'
import { GroupPlacesRepository } from './GroupPlacesRepository'
import { PlacesRepository } from './PlacesRespository'
import { LineupGroup } from '../lineups/LineupGroup'
import { LineupRepository } from './LineupRepository'
import { GroupLineupObject, GroupLineupsRepository } from './GroupLineupsRepository'


type LineupGroupObject = {
    id:number,
    name:string
}

export class LineupGroupRepository {
    private static database:SQLite.SQLiteDatabase

    public static async InitializeRepository() {
        this.database = await SQLite.openDatabaseAsync("CURADARS")
        console.log("Exec")
        this.database.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = true;
            CREATE TABLE IF NOT EXISTS lineups (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                day VARCHAR(20),
                weekend VARCHAR(20),
                place VARCHAR(100),
                roleset_id INTEGER,
                FOREIGN KEY (roleset_id) REFERENCES role_set(id)

            );
            `).then( () => {
                console.log("Database succefully started.")
            }).catch((e)=> {
                console.error("Error opening database: "+e)
            })
    }

    public static InsertLineup(lineup:Lineup) {
        let result:SQLite.SQLiteRunResult = null
        try {
            result = this.database.runSync(`INSERT INTO lineups (day,weekend,place,roleset_id) VALUES ( 
                "${lineup.day}",
                "${lineup.weekend}",
                "${lineup.place}",
                ${lineup.roleset.id}
            )`)
            lineup.id = result.lastInsertRowId
            
            lineup.roleset.set.forEach((role) => {
                let member = lineup.GetRoleMember(role)
                LineupMembersRepository.InsertLineupMember(role,member.getId(),lineup.id)
            })
            
        } catch(e) {
            console.error("Error inserting lineup: "+e)
        }

        return result
    }
    
    public static FindLineupGroupByID(id:number):LineupGroup {
        let result:LineupGroupObject = null

        try{
            result = this.database.getFirstSync(`SELECT * FROM lineups WHERE id=${id}`)

        } catch(e) {
            console.error("Error finding lineup by ID: "+e)
            return null
        }
        
        return this.BuildLineupGroup(result)
    }

    public static GetGroupPlaces(id:number):Array<string> {
        let result:Array<string> = []
        
        try {
            const places = GroupPlacesRepository.FindAllByGroupID(id)
            places.forEach((place) => result.push(PlacesRepository.FindPlaceByID(place.place_id).place))
        } catch(e) {
            console.error("Error: ")
        }
        return result
    }

    public static GetGroupLineups(id:number):Array<Lineup> {
        let result:Array<Lineup> = []

        try {
            const lineups = GroupLineupsRepository.FindAllByGroupID(id)
            lineups.forEach((line) => result.push(LineupRepository.FindLineupByID(line.lineup_id)))

        } catch(e) {
            console.error("Error: "+ e)
        }

        return result
    }

    public static BuildLineupGroup(obj:LineupGroupObject): LineupGroup {
        const group = new LineupGroup(obj.name)
        group.id = obj.id
        group.places = this.GetGroupPlaces(obj.id)
        
        const lineups:Array<GroupLineupObject> = GroupLineupsRepository.FindAllByGroupID(group.id)
        lineups.forEach((line) => {
            const lineup = LineupRepository.FindLineupByID(line.lineup_id)
            group.monthLineupsMap[line.key] = lineup
            group.lineups.push(lineup)
        })
        return group
        
    }

    public static BuildAll(objs:Array<LineupGroupObject>): Array<LineupGroup> {
        let result:Array<LineupGroup> = []

        objs.forEach((obj) => result.push(this.BuildLineupGroup(obj)))
        return result
    }
}

