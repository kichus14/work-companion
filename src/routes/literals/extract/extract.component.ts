import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Path} from '../../../app/constants/routes.constant';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss']
})
export class ExtractComponent {
  stepItems: MenuItem[] = [{
      label: 'Fetch Codes',
      routerLink: Path.extractLiterals_FetchCodes,
    }, {
      label: 'Validate Codes',
      routerLink: Path.extractLiterals_ValidateCodes,
    }, {
      label: 'Upload Literal Masters',
      routerLink: Path.extractLiterals_UploadLiterals,
    }, {
      label: 'Export Code Literals',
      routerLink: Path.extractLiterals_exportLiterals,
    }];
}
