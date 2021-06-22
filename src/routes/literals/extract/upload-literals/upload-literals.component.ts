import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Path} from 'src/app/constants/routes.constant';
import {LiteralLanguageCodes, LiteralsService} from 'src/app/services/literals.service';
import {ExtractLiteralsService} from '../extract-literals.service';

@Component({
  selector: 'app-upload-literals',
  templateUrl: './upload-literals.component.html',
  styleUrls: ['./upload-literals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadLiteralsComponent {
  legacyLiteralLanguages?: LiteralLanguageCodes[];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly literalsService: LiteralsService,
    private readonly extractLiteralsService: ExtractLiteralsService,
    private readonly router: Router,
  ) {
    if (this.extractLiteralsService.legacyLiteralLanguages != null) {
      this.legacyLiteralLanguages = this.extractLiteralsService.legacyLiteralLanguages;
    }
   }

  extractedLiterals(response: LiteralLanguageCodes[]): void {
    this.extractLiteralsService.legacyLiteralLanguages = response;
    this.legacyLiteralLanguages = response;
    this.cdr.markForCheck();
  }

  goToExportLiterals(): void {
    this.router.navigate([Path.literals, Path.extractLiterals, Path.extractLiterals_exportLiterals]);
  }
}
