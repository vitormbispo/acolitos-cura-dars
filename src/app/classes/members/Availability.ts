export class Availability {
    private id:number
    private map:object
    
    constructor() {
        this.map = {}
    }

    public getMap():object { return this.map }
    public setMap(map:object):void { this.map = map }

    /**
     * Verifica se há disponibilidade para determinada chave
     * @param key Chave
     * @returns true se houver disponibilidade
     */
    public isAvailable(key:string):boolean {
        return this.map[key];
    }
    
    /**
     * Define se há disponibilidade para determinada chave.
     * 
     * @param key Chave
     * @param available Disponível
     */
    public setAvailable(key:string,available:boolean) {
        this.map[key] = available
    }

    /**
     * Define todos os valores do mapa para um determinado valor 'value'
     * @param value Valor
     */
    public setAll(value:boolean) {
        Object.keys(this.map).forEach((key) => { this.map[key] = value })
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    removeKey(key:string):void {
        delete this.map[key]
    }
}