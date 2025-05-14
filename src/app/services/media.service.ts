import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,  throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetMediaFilter, InsertMediaFile, MediaFile, MediaFileByStoreRequest, Store, TiposRequest, TiposResponse, UpdateMediaFile } from '../models/media-file.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private apiUrl = 'http://localhost:5106/'; // URL de la API 5106 http://localhost:5106
  // private apiUrl = 'http://172.22.10.90:82/tiendasbannerApi/';


  constructor(private http: HttpClient) {}

  // Obtener los archivos multimedia
  insertMediaFiles(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}api/InsertMediaFile`, formData);
  }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.apiUrl}api/GetStores`);
  }

  getAllMedia(): Observable<MediaFile[]> {
    return this.http.get<MediaFile[]>(`${this.apiUrl}api/GetAllMedia`);
  }

  getTipos(request: TiposRequest): Observable<TiposResponse[]> {
    return this.http.post<TiposResponse[]>(`${this.apiUrl}api/GetTipos`, request);
  }

  updateMediaFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}api/UpdateMediaFile`, formData);
  }


  deleteMediaFile(request: MediaFileByStoreRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}api/DeleteFile`, request);
  }

  getMediaFilter(request: GetMediaFilter): Observable<MediaFile[]> {
    return this.http.post<MediaFile[]>(`${this.apiUrl}api/GetMediaFilter`, request);
  }
  // // Obtener archivo por ID
  // getMediaFileById(id: number): Observable<MediaFile> {
  //   return this.http.get<MediaFile>(`${this.apiUrl}/${id}`);  // Corregido aquí
  // }

  // // Crear un nuevo archivo multimedia
  // addMediaFile(mediaFile: MediaFile): Observable<MediaFile> {
  //   return this.http.post<MediaFile>(`${this.apiUrl}`, mediaFile);
  // }

  // // Actualizar un archivo multimedia
  // updateMediaFile(id: number, mediaFile: MediaFile): Observable<MediaFile> {
  //   return this.http.put<MediaFile>(`${this.apiUrl}/${id}`, mediaFile);
  // }

  // // Eliminar un archivo multimedia
  // deleteMediaFile(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);  // Corregido aquí
  // }
// }



// @Injectable({
//   providedIn: 'root'
// })
// export class MediaService {
//   // ✅ URL corregida sin doble slash
//   // private apiUrl = 'http://172.22.10.90:82/tiendasbannerApi/';
// //  private apiUrl = 'http://localhost:5106/';
// private apiUrl = 'https://servicios.impuls.com.mx:449/tiendasbannerApiTest/';

//   constructor(private http: HttpClient) {}

//   // ✅ Insertar archivos multimedia
//   insertMediaFiles(request: InsertMediaFile): Observable<any> {
//     return this.http.post(`${this.apiUrl}api/InsertMediaFile`, request).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Obtener todas las tiendas
//   getStores(): Observable<Store[]> {
//     return this.http.get<Store[]>(`${this.apiUrl}api/GetStores`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Obtener todos los archivos multimedia
//   getAllMedia(): Observable<MediaFile[]> {
//     return this.http.get<MediaFile[]>(`${this.apiUrl}api/GetAllMedia`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Obtener tipos de archivos multimedia
//   getTipos(request: TiposRequest): Observable<TiposResponse[]> {
//     return this.http.post<TiposResponse[]>(`${this.apiUrl}api/GetTipos`, request).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Actualizar archivo multimedia
//   updateMediaFile(request: UpdateMediaFile): Observable<any> {
//     return this.http.post(`${this.apiUrl}api/UpdateMediaFile`, request).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Eliminar archivo multimedia
//   deleteMediaFile(request: MediaFileByStoreRequest): Observable<any> {
//     return this.http.post(`${this.apiUrl}api/DeleteFile`, request).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Obtener archivos multimedia filtrados
//   getMediaFilter(request: GetMediaFilter): Observable<MediaFile[]> {
//     return this.http.post<MediaFile[]>(`${this.apiUrl}api/GetMediaFilter`, request).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // ✅ Manejo de errores
//   private handleError(error: HttpErrorResponse) {
//     if (error.status === 0) {
//       console.error('❌ Error de red:', error.error);
//     } else {
//       console.error(`❌ Error del backend (Código ${error.status}):`, error.message);
//     }
//     return throwError(() => new Error('Hubo un error con la solicitud; por favor, intenta de nuevo.'));
//   }
 }
