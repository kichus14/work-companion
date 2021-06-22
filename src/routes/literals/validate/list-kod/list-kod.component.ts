import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from '../../../../app/constants/routes.constant';
import {KODCode} from '../../../../app/services/literals.service';
import {ValidateLiteralsService} from '../validate-literals.service';

@Component({
  selector: 'app-list-kod',
  templateUrl: './list-kod.component.html',
  styleUrls: ['./list-kod.component.scss']
})
export class ListKodComponent {
  extractedKods?: KODCode[];
  extractKodPath = ['', Path.literals, Path.validateLiterals, Path.validateLiterals_ExtractKOD].join('/');
  cols = [
    { field: 'code', header: 'Code' },
    { field: 'type', header: 'Type' },
    { field: 'key', header: 'Key' },
  ];

  constructor(
    private readonly validateLiteralsService: ValidateLiteralsService,
    private readonly router: Router,
  ) {
    this.extractedKods = this.validateLiteralsService.extractedKods;
  }

  goToKODMapping(): void {
    this.router.navigate([Path.literals, Path.validateLiterals, Path.validateLiterals_KODMapping]);
  }

}
