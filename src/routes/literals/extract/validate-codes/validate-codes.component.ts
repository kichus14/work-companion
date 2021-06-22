import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from '../../../../app/constants/routes.constant';
import {LiteralCode} from '../../../../app/services/literals.service';
import {ExtractLiteralsService} from '../extract-literals.service';

interface TableColumn {
  field: string;
  header: string;
}


@Component({
  selector: 'app-validate-codes',
  templateUrl: './validate-codes.component.html',
  styleUrls: ['./validate-codes.component.scss']
})
export class ValidateCodesComponent {
  cols = [
    { field: 'code', header: 'Code' },
    { field: 'type', header: 'Type' },
    { field: 'text', header: 'Default Text' },
  ];
  legacyLiterals?: LiteralCode[];
  extractCodePath = ['', Path.literals, Path.extractLiterals].join('/');

  constructor(
    private readonly extractLiteralsService: ExtractLiteralsService,
    private readonly router: Router,
  ) {
    this.legacyLiterals = this.extractLiteralsService.legacyLiteralCodes;
  }

  goToUploadLiterals(): void {
    this.router.navigate([Path.literals, Path.extractLiterals, Path.extractLiterals_UploadLiterals]);
  }
}
