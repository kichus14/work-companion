import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Path} from '../../../app/constants/routes.constant';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent {
  stepItems: MenuItem[] = [{
    label: 'Extract KOD',
    routerLink: Path.validateLiterals_ExtractKOD,
  }, {
    label: 'List KOD',
    routerLink: Path.validateLiterals_listKOD,
  }, {
    label: 'Literal KOD Mapping',
    routerLink: Path.validateLiterals_KODMapping,
  }, {
    label: 'Literal Results',
    routerLink: Path.validateLiterals_literalResults,
  }];
}
