
// interface de Services

export interface MediaFile {
  id: number;
  fileName: string;
  fileType: string; // Corregido
  fileData: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  storeId: number;
  storeName:string;
  isActive: string;
  createdAt: Date,
  updatedAt: Date
}


export interface InsertMediaFile{
  FileName:string
  FileType:string
  FileData:string
  Duration:number
  StartDate:Date
  EndDate:Date
  StoreId:number
  IsActive:string
}

export interface UpdateMediaFile{
  Id:number // Primary Key
  FileName:string
  FileType:string
  FileData:string
  Duration:number
  StartDate:Date
  EndDate:Date
  StoreId:number
  IsActive:string
}



export interface Store{
    id: number,
    storeName: string
}

export interface TiposRequest{
  TabTable:string
}
export interface TiposResponse{
  name_Tipo: string,
  cod_Tipo: string
}

export interface MediaFileByStoreRequest{
  StoreId:number
}

// export interface GetMediaFilter
// {
//     p_start_date:Date
//     p_end_date:Date
//     p_is_active:string
//     p_file_type:string
//     p_store_: number;
// }


export interface GetMediaFilter {
  p_start_date: string | null;
  p_end_date: string | null;
  p_is_active: string;
  p_file_type: string;
  p_store_: number | null;
}
