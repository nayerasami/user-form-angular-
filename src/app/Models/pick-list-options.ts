export interface IpickListOptions {
    itemsArr: IpickListItems[],
    uniqueKey?:keyof any,
    showKey?:any,
    isSearchable?:boolean,
    isSortable?:boolean,
    defaultAddedArr?:any,
    defaultDelete?:any,
    defaultValuesArr?:any,
    validators?:any
    
}

export interface IpickListItems{
    id:number,
    name:string
}