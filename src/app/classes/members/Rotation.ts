export class Rotation {
    private id:number
    private map:object
    
    constructor() {
        this.map = {}
    }
    getMap():object {
        return this.map
    }
    setMap(map:object):void {
        this.map = map
    }

    /**
     * Retorna o valor do rodízio de chave 'key'
     * @param key Chave
     * @returns Valor do rodízio
     */
    getRotation(key:string): number {
        return this.map[key]
    }

    /**
     * Cria ou atualiza o valor 'value' do rodízio de chave 'key'
     * @param key Chave
     * @param value Valor
     */
    setRotation(key:string,value:number=0):void {
        this.map[key] = value
    }

    /**
     * Aumenta o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    increment(key:string):void {
        this.map[key]+=1
    }

    /**
     * Diminui o valor do rodízio da chave 'key' em 1
     * @param key Chave
     */
    decrement(key:string):void {
        this.map[key]-=1
    }

    /**
     * Remove determinada chave 'key' do mapa
     * @param key Chave
     */
    removeRotationKey(key:string):void {
        delete this.map[key]
    }

    /**
     * Reinicia o valor da chave 'key' para 0
     * @param key Chave
     */
    resetKey(key:string):void {
        this.map[key] = 0
    }
}