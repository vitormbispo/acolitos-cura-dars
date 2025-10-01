import * as SQLite from 'expo-sqlite'
import { Lineup } from '../lineups/Lineup'
import { LineupMemberObject, LineupMembersRepository } from './LineupMembersRepository'
import { RoleSetRepository } from './RoleSetRepository'
import { MemberData } from '../MemberData'


type LineupObject = {
    id:number,
    day:string,
    weekend:string,
    place:string,
    roleset_id:number
}

export class LineupRepository {
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
    
    public static FindLineupByID(id:number):Lineup {
        let result:LineupObject = null

        try{
            result = this.database.getFirstSync(`SELECT * FROM lineups WHERE id=${id}`)

        } catch(e) {
            console.error("Error finding lineup by ID: "+e)
            return null
        }
        
        return this.BuildLineup(result)
    }




    public static BuildLineup(obj:LineupObject): Lineup {
        const roleset = RoleSetRepository.FindRoleSetByID(obj.roleset_id)
        const newLine = new Lineup(roleset,obj.day,obj.weekend,obj.place)
        newLine.id = obj.id

        const lineupMembers:Array<LineupMemberObject> = LineupMembersRepository.FindAllByLineup(obj.id)
        
        lineupMembers.forEach((lineMember:LineupMemberObject) => {
            const role = lineMember.role
            const member = MemberData.FindMemberById(lineMember.member_id)
            newLine.AssignRole(role,member)
        })
  
        return newLine
    }

    public static BuildAll(objs:Array<LineupObject>): Array<Lineup> {
        let result:Array<Lineup> = []

        objs.forEach((obj) => result.push(this.BuildLineup(obj)))
        return result
    }
}

