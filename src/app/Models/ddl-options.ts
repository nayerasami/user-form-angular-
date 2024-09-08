export interface IddlOptions {
    uniqueKey?: keyof any,
    isMultiValued ?:boolean,
    isSearchable?:boolean,
    isResettable?:boolean,
    // items:any[],
    showKey?:any,
    searchKey?:any,
    baseUrl?:string,
    limit?:number,
    page?:number
    validators? :any

}

export interface Iitems {
id:number,
name:string

}