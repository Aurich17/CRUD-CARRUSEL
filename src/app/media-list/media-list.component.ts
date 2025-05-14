import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../services/media.service';
import { MediaFile } from '../models/media-file.model';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  MediaFiles: MediaFile[] = [];

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    // this.loadMediaFiles();
  }

  // loadMediaFiles(): void {
  //   this.mediaService.getMediaFiles().subscribe((data) => {
  //     this.MediaFiles = data;
  //   });
  // }

  // deleteMediaFile(id: number): void {
  //   if (confirm('¿Estás seguro que quieres eliminar este archivo?')) {
  //     this.mediaService.deleteMediaFile(id).subscribe(() => {
  //       this.loadMediaFiles();
  //     });
  //   }
  // }

}
