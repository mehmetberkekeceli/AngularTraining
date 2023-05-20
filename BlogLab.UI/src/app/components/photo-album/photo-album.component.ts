import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'app/models/photo/photo.model';
import { PhotoService } from 'app/services/photo.service';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.css']
})
export class PhotoAlbumComponent implements OnInit {

  @ViewChild('photoForm') photoForm!: NgForm; // Initialize the property with "!"
  @ViewChild('photoUploadElement') photoUploadElement!: ElementRef<HTMLInputElement>; // Initialize the property with "!"

  photos: Photo[] = [];
  photoFile: any;
  newPhotoDescription = ''; // Initialize the property with an empty string

  constructor(
    private photoService: PhotoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.photoService.getByApplicationUserId().subscribe(userPhotos => {
      this.photos = userPhotos;
    });
  }

  confirmDelete(photo: Photo) {
    photo.deleteConfirm = true;
  }

  cancelDeleteConfirm(photo: Photo) {
    photo.deleteConfirm = false;
  }

  deleteConfirmed(photo: Photo) {
    this.photoService.delete(photo.photoId).subscribe(() => {
      let index = 0;

      for (let i=0; i<this.photos.length; i++) {
        if (this.photos[i].photoId === photo.photoId) {
          index = i;
        }
      }

      if (index > -1) {
        this.photos.splice(index, 1);
      }

      this.toastr.info("Photo deleted.");
    });
  }

  onFileChange(event: Event) { // Specify the type of the event parameter
    const inputElement = event.target as HTMLInputElement; // Cast the target as HTMLInputElement
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.photoFile = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.photoFile, this.newPhotoDescription);

    this.photoService.create(formData).subscribe(createdPhoto => {
      this.photoForm.reset();
      this.photoUploadElement.nativeElement.value = '';

      this.toastr.info("Photo uploaded");
      this.photos.unshift(createdPhoto);
    });
  }
}
