import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {FileUpload} from 'primeng/fileupload';
import { bytesToSize } from 'src/app/utils/app.util';

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
