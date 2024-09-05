export interface IddlOptions {
    uniqueKey?: keyof any,
    isMultiValued ?:boolean,
    isSearchable?:boolean,
    isResettable?:boolean,
    options?:any[],
    showKey?:any,
    searchKey?:any,
    baseUrl?:string,
    limit?:number,
    page?:number
    validators? :any,
    defaultTitle?:any,
    label?:any

}

export interface Iddlitems {
id:number,
name:string

}
