import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { MediaService } from '../services/media.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { GetMediaFilter, InsertMediaFile, MediaFile, MediaFileByStoreRequest, Store, TiposRequest, TiposResponse, UpdateMediaFile } from '../models/media-file.model';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { concatMap } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-crud-media',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    MessagesModule,
    FileUploadModule,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    CommonModule,
    DropdownModule,
    TableModule,
    TagModule,
    RatingModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './crud-media.component.html',
  styleUrls: ['./crud-media.component.css']
})
export class CrudMediaComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: HttpClient,
    private readonly service: MediaService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;
  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;

  // Formularios y variables de estado
  form!: FormGroup;
  group_dialog!: FormGroup;
  isLoading: boolean = false;
  visible: boolean = false;        // Diálogo para agregar/editar
  visibleFile: boolean = false;      // Diálogo para vista previa
  labelArchivo: string = "CARGA";
  archivoCargado: boolean = false;
  fileName: string = '';
  fileType: string = '';
  fileData: any = null;
  fileBlob: Blob | null = null;
  previewUrl: string = '';
  duration: number | null = null;
  idFile = 0;
  dataTableCarga = false;

  // Variables para listas y filtros
  tiendas: Store[] = [];
  estados: TiposResponse[] = [];
  tiposArchivo: TiposResponse[] = [];
  mediaFiles: MediaFile[] = [];
  // Variables para manejar el tipo de archivo
  isImage: boolean = false;
  isVideo: boolean = false;
  tipoSeleccionado: any;

  ngOnInit() {
    this.inicializarFormulario();
    this.getStores();
    this.getTipos();
    this.getAllMedia();
  }

  inicializarFormulario() {
    this.form = new FormGroup({
      fechaInicio: new FormControl(null),
      fechaFin: new FormControl(null),
      estado: new FormControl(null),
      tipo: new FormControl(null),
      tienda: new FormControl(null)
    });
    this.group_dialog = new FormGroup({
      nombreArchivo: new FormControl(null),
      tipoArchivo: new FormControl(null),
      duracion: new FormControl(null),
      fechaInicio: new FormControl(null),
      fechaFin: new FormControl(null),
      tienda: new FormControl(null),
      estado: new FormControl(null)
    });
  }

  // Abre el diálogo de agregar/editar y carga datos si se pasa un producto
  showDialog(tipo: string, product?: any) {
    this.visible = true;
    if (tipo === 'E' && product) {
      this.idFile = product.id;
      this.group_dialog.patchValue({
        nombreArchivo: product.fileName,
        tipoArchivo: product.fileType,
        duracion: product.duration,
        fechaInicio: new Date(product.startDate),
        fechaFin: new Date(product.endDate),
        tienda: product.storeId,
        estado: product.isActive
      });
      this.fileData = product.fileData;
      this.archivoCargado = !!product.fileData;
      this.fileName = product.fileName;
      this.tipoSeleccionado = product.fileType;
      this.isImage = product.fileType === '001';
      this.isVideo = product.fileType === '002';
      // Aseguramos el MIME type adecuado
      this.fileType = product.fileType === '001' ? 'image/png' : 'video/mp4';
      if (this.fileData) {
        try {
          const decoded = atob(this.fileData);
          const byteArray = new Uint8Array(decoded.length);
          for (let i = 0; i < decoded.length; i++) {
            byteArray[i] = decoded.charCodeAt(i);
          }
          this.fileBlob = new Blob([byteArray], { type: this.fileType });
          this.previewUrl = URL.createObjectURL(this.fileBlob);
        } catch (e) {
          console.error('Error al decodificar Base64:', e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo recibido del backend no es válido.',
            life: 3000
          });
        }
      }
    } else {
      this.reinicio();
    }
  }

  reinicio() {
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.archivoCargado = false;
    this.fileName = '';
    this.fileData = null;
    this.fileBlob = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
    }
    this.fileType = '';
    this.isImage = false;
    this.isVideo = false;
    this.visibleFile = false;
    this.labelArchivo = "CARGA";
    this.group_dialog.reset();
  }

  // Procesa la selección de archivo desde p-fileUpload
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
      if (file && validTypes.includes(file.type)) {
        this.fileBlob = file;
        this.fileType = file.type; // Por ejemplo: "video/mp4"
        this.fileName = file.name;
        this.labelArchivo = "CARGADO";
        this.archivoCargado = true;
        const tipoArchivo = file.type.startsWith('image') ? '001' : '002';
        this.group_dialog.patchValue({ tipoArchivo });
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.fileData = result.split(',')[1];
        };
        reader.onerror = () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo leer el archivo.',
            life: 3000
          });
          this.fileUpload?.clear();
        };
        reader.readAsDataURL(file);

        if (file.type.startsWith('video/')) {
          // Se crea una URL del Blob y se carga para obtener metadatos
          const url = URL.createObjectURL(file);
          const video = document.createElement('video');
          video.src = url;
          video.onloadedmetadata = () => {
            this.duration = video.duration;
            this.group_dialog.patchValue({ duracion: Math.round(video.duration) });
            this.previewUrl = url;
            this.cdr.detectChanges();
          };
          video.onerror = () => {
            console.error('Error al verificar el video');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'El video no es válido o su formato no es soportado.',
              life: 3000
            });
            this.fileUpload?.clear();
            URL.revokeObjectURL(url);
          };
        } else if (file.type.startsWith('image/')) {
          this.previewUrl = URL.createObjectURL(file);
          this.cdr.detectChanges();
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Solo se permiten imágenes (JPEG, PNG) o videos (MP4, WebM).',
          life: 3000
        });
        this.fileUpload?.clear();
      }
    }
  }

  // Obtiene la URL de vista previa para imágenes
  getImageSrc(): string {
    return this.previewUrl && this.group_dialog.get('tipoArchivo')?.value === '001'
      ? this.previewUrl
      : '';
  }

  // Obtiene la URL de vista previa para videos
  getVideoSrc(): string {
    return this.previewUrl && this.group_dialog.get('tipoArchivo')?.value === '002'
      ? this.previewUrl
      : '';
  }

  // Muestra el diálogo de vista previa (sin descarga)
  mostrarArchivo() {
    if (!this.fileBlob) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay archivo cargado para mostrar.',
        life: 3000
      });
      return;
    }
    const tipoArchivo = this.group_dialog.get('tipoArchivo')?.value;
    if (tipoArchivo === '001') {
      this.isImage = true;
      this.isVideo = false;
      if (!this.previewUrl) {
        this.previewUrl = URL.createObjectURL(this.fileBlob);
      }
    } else if (tipoArchivo === '002') {
      this.isImage = false;
      this.isVideo = true;
      if (!this.previewUrl) {
        this.previewUrl = URL.createObjectURL(this.fileBlob);
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Selecciona un tipo de archivo válido.',
        life: 3000
      });
      return;
    }
    this.visibleFile = true;
    this.cdr.detectChanges();

    // Si es video, se asigna la URL y se reproduce en el elemento referenciado
    if (this.isVideo && this.videoPreview) {
      this.videoPreview.nativeElement.src = this.previewUrl;
      this.videoPreview.nativeElement.load();
      this.videoPreview.nativeElement.play().catch(error => {
        console.error('Error al reproducir el video:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo reproducir el video: ' + error.message,
          life: 3000
        });
      });
    }
  }

  onImageError(event: Event) {
    console.error('Error al cargar la imagen:', event);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la imagen.',
      life: 3000
    });
  }

  onVideoError(event: Event) {
    console.error('Error al cargar el video:', event);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar el video.',
      life: 3000
    });
  }

  // Método buscar con la propiedad obligatoria p_store_
  buscar() {
    this.dataTableCarga = true;
    const values = this.form.value;
    const requestMediaFile: GetMediaFilter = {
      p_start_date: values.fechaInicio,
      p_end_date: values.fechaFin,
      p_is_active: values.estado,
      p_file_type: values.tipo,
      p_store_: values.tienda // Se incluye la propiedad obligatoria
    };
    this.service.getMediaFilter(requestMediaFile).subscribe({
      next: (data) => {
        this.mediaFiles = data;
        this.dataTableCarga = false;
      },
      error: (error) => {
        console.error('ERROR:', error);
        this.dataTableCarga = false;
      }
    });
  }

  getAllMedia() {
    this.dataTableCarga = true;
    this.service.getAllMedia().subscribe({
      next: (data) => {
        this.mediaFiles = data;
        this.dataTableCarga = false;
      },
      error: (error) => {
        console.error('ERROR:', error);
        this.dataTableCarga = false;
      }
    });
  }

  getStores() {
    this.service.getStores().subscribe({
      next: (data) => { this.tiendas = data; },
      error: (error) => { console.error('ERROR:', error); }
    });
  }

  getTipos() {
    const requestTipos: TiposRequest = { TabTable: 'EST' };
    this.service.getTipos(requestTipos).pipe(
      concatMap((data1) => {
        this.estados = data1;
        requestTipos.TabTable = 'ARC';
        return this.service.getTipos(requestTipos);
      })
    ).subscribe({
      next: (data2) => { this.tiposArchivo = data2; },
      error: (error) => { console.error('ERROR:', error); }
    });
  }

  saveMediaFile() {
    this.isLoading = true;
    const values = this.group_dialog.value;
    const requestMediaInsert: InsertMediaFile = {
      FileName: values.nombreArchivo,
      FileType: values.tipoArchivo,
      FileData: this.fileData,
      Duration: values.duracion,
      StartDate: values.fechaInicio,
      EndDate: values.fechaFin,
      StoreId: values.tienda,
      IsActive: values.estado
    };
    this.service.insertMediaFiles(requestMediaInsert).subscribe({
      next: (data) => {
        if (data.status === 'OK') {
          this.reinicio();
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo Guardado',
            detail: 'El archivo se guardó correctamente.',
            life: 3000
          });
          this.isLoading = false;
          this.visible = false;
          this.getAllMedia();
        }
      },
      error: (error) => {
        console.error('Error al guardar el archivo:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 3000
        });
      }
    });
  }

  actualizarMediaFile() {
    this.isLoading = true;
    const values = this.group_dialog.value;
    const requestMediaUpdate: UpdateMediaFile = {
      Id: this.idFile,
      FileName: values.nombreArchivo,
      FileType: values.tipoArchivo,
      FileData: this.fileData,
      Duration: values.duracion,
      StartDate: values.fechaInicio,
      EndDate: values.fechaFin,
      StoreId: values.tienda,
      IsActive: values.estado
    };
    this.service.updateMediaFile(requestMediaUpdate).subscribe({
      next: (data) => {
        if (data.status === 'OK') {
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo Actualizado',
            detail: 'El archivo se actualizó correctamente.',
            life: 3000
          });
          this.isLoading = false;
          this.visible = false;
          this.reinicio();
          this.getAllMedia();
        }
      },
      error: (error) => {
        console.error('Error al actualizar el archivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se actualizó el archivo',
          life: 3000
        });
      }
    });
  }

  confirm2(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que deseas eliminar este archivo?',
      header: 'Eliminar archivo',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => { this.deleteMediaFile(id); }
    });
  }

  deleteMediaFile(id: number) {
    const requestMediaDelete: MediaFileByStoreRequest = { StoreId: id };
    this.service.deleteMediaFile(requestMediaDelete).subscribe({
      next: (data) => {
        if (data.status === 'OK') {
          this.getAllMedia();
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo Eliminado',
            detail: 'El archivo se eliminó correctamente.',
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar el archivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se eliminó el archivo',
          life: 3000
        });
      }
    });
  }
}
