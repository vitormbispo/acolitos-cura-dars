import { LineupGroup } from "./lineups/LineupGroup"
import { Member } from "./members/Member"
import { MemberType } from "./members/MemberType"
import { MemberRepository } from "./repository/MemberRepository"

/**
 *  Dados armazenados dos Membros
 */
export class MemberData{ 
    static allAcolytes: Member[] = []
    static allCoroinhas: Member[] = []
    private static allMembers: Member[] = []
    static allLineups = [];
    static allLineupsAcolytes:Array<LineupGroup> = []
    static allLineupsCoroinhas:Array<LineupGroup> = []

    /**
     * Verifica a integridade dos dados dos membros e salva
     * as alterações necessárias
     */
    static VerifyMemberDataIntegrity(){
        if(this.allAcolytes == null){
            this.allAcolytes = []
        }
        if(this.allCoroinhas == null){
            this.allCoroinhas = []
        }
        if(this.allLineupsAcolytes == null){
            this.allLineupsAcolytes = []
        }
        if(this.allLineupsCoroinhas == null){
            this.allLineupsCoroinhas = []
        }
        //this.SaveMemberData()
    }

    public static SortMembersList() {
        this.allMembers.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    public static AddNewMember(member:Member,sortList:boolean=true) {
        this.allMembers.push(member)
        if(sortList) this.SortMembersList()
    }

    public static UpdateMember(member:Member,sortList:boolean=true) {
        let index = this.allMembers.findIndex((m:Member) => m.equals(member))
        this.allMembers[index] = member
        if(sortList) this.SortMembersList()
    }
    public static RemoveMember(member:Member) {
        let index = this.allMembers.findIndex((m:Member) => m.equals(member))
        this.allMembers.splice(index,1)
    }

    public static RemoveMemberByID(id:number) {
        let index = this.allMembers.findIndex((m:Member) => m.id == id)
        this.allMembers.splice(index,1)
    }

    public static GetAllMembers() {
        return this.allMembers
    }

    public static GetAllMembersCopy() {
        return this.allMembers.slice()
    }

    public static FindMemberById(id:number): Member {
        let member:Member = this.allMembers.find((m:Member) => m.id == id)
        return member
    }

    public static FindMembersByType(type:MemberType):Array<Member> {
        return this.allMembers.filter((member) => member.type == type)
    }

    public static UpdatePlaceMaps() {
        this.allMembers.forEach((member) => {
            member.availability.placeAvailability.updateMap()
            member.rotation.placeRotation.updateMap()
        })
    }

    public static UpdateDayMaps() {
        this.allMembers.forEach((member) => {
            member.availability.dayAvailability.updateMap()
            member.rotation.dayRotation.updateMap()
        })
    }

    public static UpdateRolesMaps() {
        this.allMembers.forEach((member) => {
            member.rotation.roleRotation.updateMap()
        })
    }

    public static async InitializeMemberData() {
        return await this.LoadMembersFromDatabase()
    }

    // DATABASE
    public static async LoadMembersFromDatabase() {
        await MemberRepository.FindAllMembersAsync().then(
            (result) => {
                this.allMembers = result
                this.SortMembersList()
            },
            (e) => console.error("Error loading member data: " + e)
        )

        return Promise.resolve()
    }

    public static LoadMembersFromDatabaseSync() {
        try {
            this.allMembers = MemberRepository.FindAllMembers()
            this.SortMembersList()
        } catch(e) {
            console.error("Error loading member data: "+e)
        }
    }

    public static InsertMemberOnDB(member: Member, updateMemberList: boolean = true) {
        if (updateMemberList) this.AddNewMember(member)
        return MemberRepository.InsertMember(member)
    }

    public static UpdateMemberOnDB(member: Member, updateMemberList: boolean = true) {
        if (updateMemberList) this.UpdateMember(member)
        return MemberRepository.UpdateMember(member)
    }

    public static DeleteMemberByIDOnDB(id: number, updateMemberList: boolean = true) {
        if (updateMemberList) this.RemoveMemberByID(id)
        return MemberRepository.DeleteMemberById(id)
    }


    // ASYNC
    public static async InsertMemberOnDBAsync(member: Member, updateMemberList: boolean = true) {
        if (updateMemberList) this.AddNewMember(member)
        return await MemberRepository.InsertMemberAsync(member)
    }

    public static async UpdateMemberOnDBAsync(member: Member, updateMemberList: boolean = true) {
        if (updateMemberList) this.UpdateMember(member)
        return await MemberRepository.UpdateMemberAsync(member)
    }

    
    /**
     * Retorna uma lista com todas as escalas dos acólitos e coroinhas
     * @returns 
     */
    static GetAllLineups():Array<any>{
        let joined = MemberData.allLineupsAcolytes.concat(MemberData.allLineupsCoroinhas)
        if(joined == null){
            joined = []
        }
        return joined
    }
    
    /**
     * Checa se um nome já está em uso ou não
     * @param name nome
     * @param members membros
     * @returns 
     */
    static IsNameAvailable(name:string,members:Array<Member>):boolean{
        for(let i = 0; i < members.length; i++){
            if(members[i].name == name){
                return false
            }
        }
        return true
    }

    /**
     * Checa se um apelido já está em uso ou não
     * @param nick apelido
     * @param members membros
     * @returns 
     */
    static IsNickAvailable(nick:string,members:Array<Member>):boolean{
        for(let i = 0; i < members.length; i++){
            if(members[i].nick == nick){
                return false
            }
        }
        return true
    }
}


/**
 * Retorna uma lista com os IDs dos membros presentes em uma lista
 * @param members Lista de membros
 * @returns Lista de IDs
 */
export function MemberIDList(members:Array<Member>):Array<number>{
    let ids = []
    members.forEach((member)=>{
        ids.push(member.id)
    })
    return ids
}

/** 
 * Retorna uma lista de Membros a partir de uma lista de IDs.
 * @param ids Lista de IDs
 * @returns Lista de membros
 */
export function MembersFromIDs(ids:Array<number>):Array<Member>{
    let members = []
    let allMembers = MemberData.GetAllMembers()
    ids.forEach((id)=>{
        let member = GetMemberByID(id,allMembers)
        member != null ? members.push(member) : null
    })
    return members
}

/**
 * Retorna o membro com determinado ID
 * @param id ID
 * @param members Lista de membros 
 */
export function GetMemberByID(id:number,members:Array<Member>):Member{
    for(let i = 0; i < members.length; i++){
        if(members[i].id == id) {
            return members[i]
        } 
    }
    return null
}