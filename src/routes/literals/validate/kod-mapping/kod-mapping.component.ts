import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from '../../../../app/constants/routes.constant';
import {KODCode, LiteralLanguageCodes, LiteralLanguageCodeView} from '../../../../app/services/literals.service';
import {getLiteralMapping} from '../../../../app/utils/literals-mapping';
import {ValidateLiteralsService} from '../validate-literals.service';

@Component({
  selector: 'app-kod-mapping',
  templateUrl: './kod-mapping.component.html',
  styleUrls: ['./kod-mapping.component.scss']
})
export class KodMappingComponent {
  extractedKods?: KODCode[];
  masterLiterals?: LiteralLanguageCodeView[];
  extractKodPath = ['', Path.literals, Path.validateLiterals, Path.validateLiterals_ExtractKOD].join('/');
  columns = [
    { field: 'id', header: 'Code' },
    { field: 'type', header: 'Type' },
    { field: 'key', header: 'Key' },
    { field: 'de', header: 'German' },
    { field: 'en', header: 'English' },
    { field: 'fr', header: 'French' },
    { field: 'nl', header: 'Dutch' },
  ];
  exportFileName: string = this.fileName;

  constructor(
    private readonly validateLiteralsService: ValidateLiteralsService,
    private readonly router: Router,
  ) {
    this.extractedKods = this.validateLiteralsService.extractedKods;
    this.masterLiterals = this.validateLiteralsService.extractedKodTranslations;
  }

  get fileName(): string {
    return `literals_extract_${new Date().toLocaleString().replace(/\/|,|\s|:/g, '')}`;
  }

  extractedLiterals(literals: LiteralLanguageCodes[]): void {
    this.masterLiterals = getLiteralMapping(this.extractedKods, literals);
    this.exportFileName = this.fileName;
  }

  goToResults(): void {
    this.validateLiteralsService.extractedKodTranslations = this.masterLiterals;
    this.router.navigate([Path.literals, Path.validateLiterals, Path.validateLiterals_literalResults]);
  }

}
