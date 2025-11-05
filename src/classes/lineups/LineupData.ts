import { MemberData } from "../members/MemberData";
import { Member } from "../members/Member";
import { MemberType } from "../members/MemberType";
import { LineupGroupRepository } from "../repository/LineupGroupRepository";
import { RoleSet } from "../roles/RoleSet";
import { Lineup } from "./Lineup";
import { LineupGroup } from "./LineupGroup";
import { SerializedLineup, SerializedMember } from "./SerializedLineup";

export class LineupData {
    public static savedLineups:Array<LineupGroup>

    /**
     * Inicializa os dados das escalas
     */
    public static InitializeLineupData() {
        this.savedLineups = LineupGroupRepository.FindAllLineupGroups()
    }

    /**
     * Adiciona um novo grupo de escalas à lista de escalas salvas
     * @param lineups Grupo de escalas
     */
    public static AddLineups(lineups:LineupGroup) {
        this.savedLineups = [lineups].concat(this.savedLineups)
    }

    /**
     * Atualiza um grupo de escalas a partir de seu ID
     * @param id ID do grupo a ser modificado
     * @param updated Grupo com as modificações
     * @returns 
     */
    public static UpdateLineups(id:number,updated:LineupGroup) {
        let index = this.savedLineups.findIndex((line) => line.id == id)
        
        if(index == -1) return
        else this.savedLineups[index] = updated
    }

    /**
     * Atualiza um grupo de escalas a partir de seu índice
     * @param index Índice do grupo a ser modificado
     * @param updated Grupo com as modificações
     * @returns 
     */
    public static UpdateLineupsByIndex(index:number,updated:LineupGroup) {
        this.savedLineups[index] = updated
    }

    /**
     * Filtra as escalas por tipo de membro
     * @param type Tipo de membro
     * @returns Uma `Array<LineupGroup>` contendo os grupos filtrados
     */
    public static FindLineupsByType(type:MemberType):Array<LineupGroup> {
        return this.savedLineups.filter((line)=>line.type == type)
    }

    /**
     * Remove um grupo de escalas da lista
     * @param group Grupo de escalas a ser removido
     */
    public static RemoveGroup(group:LineupGroup) {
        let index = this.savedLineups.indexOf(group)
        if(index == -1) {
            console.error("This group doesn't exist!")
            return
        }

        this.savedLineups.splice(index,1)
        LineupGroupRepository.Delete(group.id)
    }

    /**
     * Remove um grupo de escalas da lista a partir de seu índice
     * @param index Índice do grupo de escalas a ser removido
     */
    public static RemoveGroupByIndex(index:number) {
        if(index == -1) {
            console.error("This group doesn't exist!")
            return
        }
        
        let group = this.savedLineups[index]
        LineupGroupRepository.Delete(group.id)
        this.savedLineups.splice(index,1)
    }
}