export enum SQLErrorCode {
    ERROR,
    NOT_UNIQUE
}

export class SQLErrors {
    public static Catch(error:any):SQLErrorCode {
        if(error.message.includes("UNIQUE constraint failed")) return SQLErrorCode.NOT_UNIQUE
    }
}