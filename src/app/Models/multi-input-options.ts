export interface ImultiInputOptions {
    inputsArray: ImultiInputAttributes[],
    maxNumberOfControls?: number,
    formGroupValidators?:any,
    errorMessages?:any,
    formArrayValidators:any,
    formArrayErrors:any ,
    defaultControlValues?:any    ,
    updatedDataValues?:any ,

}

export interface ImultiInputAttributes{

        type:string,
        label: string,
        name:  string,
        inputType: string,
        value?:string,
        validators?: any[],
        errorMessages?: {}
      

}