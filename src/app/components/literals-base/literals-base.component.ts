import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {FileUpload} from 'primeng/fileupload';

function bytesToSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Byte';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

@Component({
  selector: 'app-literals-base',
  templateUrl: './literals-base.component.html',
  styleUrls: ['./literals-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiteralsBaseComponent{
  @Output()
  filesSelected = new EventEmitter<File[]>();

  constructor(
    private readonly confirmationService: ConfirmationService,
  ) {}

  fileUploaded(event: any): void {
    this.filesSelected.emit(event.files);
  }

  convertFileSize(size: number): string {
    return bytesToSize(size);
  }

  removeFile(event: Event, file: File, uploader: FileUpload): void {
    this.confirmationService.confirm({
      target: event.target ? event.target : undefined,
      message: 'Are you sure that you want to remove the file?',
      icon: 'pi pi-exclamation-circle text-danger',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-outlined p-button-danger',
      accept: () => {
        const index = uploader.files.indexOf(file);
        uploader.remove(event, index);
        uploader.cd.detectChanges();
      }
    });
  }
}
