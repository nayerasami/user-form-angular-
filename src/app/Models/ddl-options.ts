export interface IddlOptions {
    
    optionsArr:any[],
    ddlconfigOptions:IddlConfig
    
}


export interface IddlConfig {
    uniqueKey?: keyof any,
    isMultiValued ?:boolean,
    isSearchable?:boolean,
    isResettable?:boolean,
    showKey?:any,
    searchKey?:any,
    baseUrl?:string,
    limit?:number,
    page?:number
    validators? :any
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
