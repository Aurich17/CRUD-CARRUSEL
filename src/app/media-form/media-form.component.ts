import { Component, OnInit } from '@angular/core';
import { MediaFile } from '../models/media-file.model';
import { MediaService } from '../services/media.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './media-form.component.html',
  styleUrls: ['./media-form.component.css']
})
export class MediaFormComponent implements OnInit {
  mediaFile: MediaFile = {
    id: 0,
    fileName: '',
    filePath: '',
    fileType: '', // Uso correcto
    uploadedAt: '',
    duration: 0,
    startDate: 0,
    endDate: '',
    storeId: 0,
  };

  isEditMode: boolean = false;

  constructor(
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('MediaFormComponent cargando');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.mediaService.getMediaFileById(Number(id)).subscribe(data => {
        this.mediaFile = data;
      });
    }
  }

  save(): void {
    if (this.isEditMode) {
      this.mediaService.updateMediaFile(this.mediaFile.id, this.mediaFile).subscribe(() => {
        this.router.navigate(['/media-list']);
      });
    } else {
      this.mediaService.addMediaFile(this.mediaFile).subscribe(() => {
        this.router.navigate(['/media-list']);
      });
    }
  }
}
