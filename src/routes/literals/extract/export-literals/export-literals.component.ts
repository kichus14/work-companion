import {Component} from '@angular/core';
import {Path} from '../../../../app/constants/routes.constant';
import {LiteralCode, LiteralLanguageCodes, LiteralLanguageCodeView} from '../../../../app/services/literals.service';
import {getLiteralMapping} from '../../../../app/utils/literals-mapping';
import {ExtractLiteralsService} from '../extract-literals.service';

interface TableColumn {
  field: string;
  header: string;
}

@Component({
  templateUrl: './export-literals.component.html',
  styleUrls: ['./export-literals.component.scss']
})
export class ExportLiteralsComponent {
  cols: TableColumn[] = [
    { field: 'pathName', header: 'Folder' },
    { field: 'id', header: 'Code' },
    { field: 'type', header: 'Type' },
    { field: 'de', header: 'German' },
    { field: 'en', header: 'English' },
    { field: 'fr', header: 'French' },
    { field: 'nl', header: 'Dutch' },
  ];
  legacyLiterals?: LiteralCode[];
  legacyLiteralLanguages?: LiteralLanguageCodes[];
  extractedLiteralLanguages?: LiteralLanguageCodeView[];
  extractCodePath = ['', Path.literals, Path.extractLiterals].join('/');
  uploadLiteralsMasterPath = ['', Path.literals, Path.extractLiterals, Path.extractLiterals_UploadLiterals].join('/');
  exportFileName: string = this.fileName;

  constructor(
    private readonly extractLiteralsService: ExtractLiteralsService,
  ) {
    const {legacyLiteralCodes, legacyLiteralLanguages} = this.extractLiteralsService;
    this.legacyLiterals = legacyLiteralCodes;
    this.legacyLiteralLanguages = legacyLiteralLanguages;
    if (legacyLiteralCodes != null && legacyLiteralLanguages != null) {
      this.extractedLiteralLanguages = getLiteralMapping(legacyLiteralCodes, legacyLiteralLanguages);
    }
  }

  get fileName(): string {
    return `legacy_literals_${new Date().toLocaleString().replace(/\/|,|\s|:/g, '')}`;
  }
}
