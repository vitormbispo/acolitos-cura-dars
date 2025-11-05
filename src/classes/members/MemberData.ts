import { LineupGroup } from "../lineups/LineupGroup"
import { Member } from "./Member"
import { MemberType } from "./MemberType"
import { MemberRepository } from "../repository/MemberRepository"

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

    /**
     * Organiza a lista de membros por nome
     */
    public static SortMembersList() {
        this.allMembers.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    /**
     * Adiciona um novo membro a lista
     * Pode opcionalmente atualizar o banco de dados e organizar a lista 
     * @param member Membro a ser adicionado
     * @param updateDB Quando `true` atualiza o banco de dados. (padrão: `false`)
     * @param sortList Quando `true` organiza a lista de membros. (padrão: `true`)
     */
    public static AddNewMember(member:Member, updateDB:boolean=false, sortList:boolean=true) {
        this.allMembers.push(member)
        if(sortList) this.SortMembersList()
        if(updateDB) MemberRepository.InsertMember(member)
    }

    /**
     * Atualiza um membro da lista
     * Pode opcionalmente atualizar o banco de dados e organizar a lista 
     * @param member Membro a ser atualizado
     * @param updateDB Quando `true` atualiza o banco de dados. (padrão: `false`)
     * @param sortList Quando `true` organiza a lista de membros. (padrão: `true`)
     */
    public static UpdateMember(member:Member,updateDB:boolean=false,sortList:boolean=true) {
        let index = this.allMembers.findIndex((m:Member) => m.equals(member))
        this.allMembers[index] = member
        if(sortList) this.SortMembersList()
        if(updateDB) MemberRepository.UpdateMember(member)
    }

    /**
     * Remove um membro da lista
     * Pode opcionalmente atualizar o banco de dados e organizar a lista 
     * @param member Membro a ser removido
     * @param updateDB Quando `true` atualiza o banco de dados. (padrão: `false`)
     * @param sortList Quando `true` organiza a lista de membros. (padrão: `true`)
     */
    public static RemoveMember(member:Member,updateDB:boolean=false) {
        let index = this.allMembers.findIndex((m:Member) => m.equals(member))
        this.allMembers.splice(index,1)
        if(updateDB) MemberRepository.DeleteMemberById(member.id)
    }

    /**
     * Remove um membro da lista pelo seu ID
     * Pode opcionalmente atualizar o banco de dados e organizar a lista 
     * @param id ID do membro a ser removido
     * @param updateDB Quando `true` atualiza o banco de dados. (padrão: `false`)
     * @param sortList Quando `true` organiza a lista de membros. (padrão: `true`)
     */
    public static RemoveMemberByID(id:number,updateDB:boolean=false) {
        let index = this.allMembers.findIndex((m:Member) => m.id == id)
        this.allMembers.splice(index,1)
        if(updateDB) MemberRepository.DeleteMemberById(id)
    }

    /**
     * Retorna a lista com todos os membros
     * @returns Lista com todos os membros
     */
    public static GetAllMembers() {
        return this.allMembers
    }

    /**
     * Retorna uma cópia da lista com todos os membros
     * @returns Cópia da lista com todos os membros
     */
    public static GetAllMembersCopy():Array<Member> {
        return this.allMembers.slice()
    }

    /**
     * Retorna o membro com determinado ID
     * @param id ID do membro
     * @returns Objeto `Member` com o ID requisitado
     */
    public static FindMemberById(id:number): Member {
        let member:Member = this.allMembers.find((m:Member) => m.id == id)
        return member
    }

    /**
     * Retorna uma lista com todos os membros de determinado tipo
     * @param type Tipo de membro
     * @returns `Array<Member>` com os membros do tipo
     */
    public static FindMembersByType(type:MemberType):Array<Member> {
        return this.allMembers.filter((member) => member.type == type)
    }

    /**
     * Atualiza os mapas de disponibilidade e rotação de locais
     * de todos os membros
     */
    public static UpdatePlaceMaps() {
        this.allMembers.forEach((member) => {
            member.availability.placeAvailability.updateMap()
            member.rotation.placeRotation.updateMap()
        })
    }

    /**
     * Atualiza os mapas de disponibilidade e rotação de dias
     * de todos os membros
     */
    public static UpdateDayMaps() {
        this.allMembers.forEach((member) => {
            member.availability.dayAvailability.updateMap()
            member.rotation.dayRotation.updateMap()
        })
    }

     /**
     * Atualiza os mapas de rotação de funções
     * de todos os membros
     */
    public static UpdateRolesMaps() {
        this.allMembers.forEach((member) => {
            member.rotation.roleRotation.updateMap()
        })
    }

    /**
     * Inicializa os dados dos membros
     * @returns `Promise`
     */
    public static async InitializeMemberData(): Promise<void>{
        return await this.LoadMembersFromDatabase()
    }

    // DATABASE
    /**
     * Carrega os membros armazenados no banco de dados
     * @returns `Promise`
     */
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

     /**
     * Carrega os membros armazenados no banco de dados
     * @returns `Promise`
     */
    public static LoadMembersFromDatabaseSync() {
        try {
            this.allMembers = MemberRepository.FindAllMembers()
            this.SortMembersList()
        } catch(e) {
            console.error("Error loading member data: "+e)
        }
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