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
    optionsArr?:Iddlitems[],
    label?:string,
    name?:string,
    defaultTitle?: string,
    multiSelectValidators?:any
    singleSelectValidators?:any

}

export interface Iddlitems {
id:number,
name:string

}
