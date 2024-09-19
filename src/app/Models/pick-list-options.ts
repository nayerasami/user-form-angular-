export interface IpickListOptions {
    itemsArr?: any[],
    uniqueKey?:keyof any,
    showKey?:any,
    isSearchable?:boolean,
    isSortable?:boolean,
    defaultAddedArr?:any,
    defaultDelete?:any,
    defaultValuesArr?:any,
    validators?:any,
    baseUrl?:string
    
}

export interface IpickListItems{
    id:number,
    name:string
}