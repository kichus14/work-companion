import {ChangeDetectorRef, Component} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {from, Observable} from 'rxjs';
import {finalize, map, mergeMap, toArray} from 'rxjs/operators';
import {Path} from '../../../../app/constants/routes.constant';
import {BranchFile} from '../../../../app/services/bitbucket-folders.service';
import {LiteralLanguageCodeView, LiteralsService, LiteralTypes, XLFLanguage, XLFLiterals} from '../../../../app/services/literals.service';
import {ValidateLiteralsService} from '../validate-literals.service';

enum ResultState {
  fail = 'Fail',
  pass = 'Pass'
}

interface LanguageResult {
  actual: string;
  expected: string;
  result: ResultState;
}

interface LiteralResult {
  id: string;
  code?: string;
  type?: LiteralTypes;
  file?: BranchFile;
  result: ResultState;
  en: LanguageResult;
  de: LanguageResult;
  fr: LanguageResult;
  nl: LanguageResult;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  literalResultStates = ResultState;
  selectedBranchFiles?: TreeNode[];
  selectedFiles: BranchFile[] | undefined;
  extractedKodTranslations?: LiteralLanguageCodeView[];
  translationResults?: LiteralResult[];
  exportFileName: string = this.fileName;
  extractKodPath = ['', Path.literals, Path.validateLiterals, Path.validateLiterals_ExtractKOD].join('/');
  blocked = false;
  columns = [
    { field: 'result', header: 'Result' },
    { field: 'type', header: 'Type' },
    { field: 'code', header: 'Code' },
    { field: 'id', header: 'Key' },
    { field: 'file.path', header: 'File Path' },
    { field: 'de.result', header: 'German Result' },
    { field: 'de.actual', header: 'German Actual (in .xlf file)' },
    { field: 'de.expected', header: 'German Expected' },
    { field: 'en.result', header: 'English Result' },
    { field: 'en.actual', header: 'English Actual (in .xlf file)' },
    { field: 'en.expected', header: 'English Expected' },
    { field: 'fr.result', header: 'French Result' },
    { field: 'fr.actual', header: 'French Actual (in .xlf file)' },
    { field: 'fr.expected', header: 'French Expected' },
    { field: 'nl.result', header: 'Dutch Result' },
    { field: 'nl.actual', header: 'Dutch Actual (in .xlf file)' },
    { field: 'nl.expected', header: 'Dutch Expected' },
  ];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly literalsService: LiteralsService,
    private readonly validateLiteralsService: ValidateLiteralsService
  ) {
    this.selectedBranchFiles = this.validateLiteralsService.branchFiles;
    this.extractedKodTranslations = this.validateLiteralsService.extractedKodTranslations;
  }

  get fileName(): string {
    return `literals_result_${new Date().toLocaleString().replace(/\/|,|\s|:/g, '')}`;
  }

  onFilesSelected(files: BranchFile[]): void {
    if (this.extractedKodTranslations == null) {
      return;
    }
    const kodsToValidate = this.extractedKodTranslations;
    this.selectedFiles = files;
    this.blocked = true;
    this.loadTransFiles(files)
      .pipe(
        map((response) => {
          const literalResults: LiteralResult[] = [];
          kodsToValidate.forEach((kod) => {
            if (kod.key == null) {
              return;
            }
            const deLiteral = this.getTransLanguage(response, 'de', kod.key);
            const enLiteral = this.getTransLanguage(response, 'en', kod.key);
            const frLiteral = this.getTransLanguage(response, 'fr', kod.key);
            const nlLiteral = this.getTransLanguage(response, 'nl', kod.key);
            const deResult = this.getResultState(kod.de, deLiteral);
            const enResult = this.getResultState(kod.en, enLiteral);
            const nlResult = this.getResultState(kod.nl, nlLiteral);
            const frResult = this.getResultState(kod.fr, frLiteral);
            const litResult: LiteralResult = {
              id: kod.key,
              code: kod.id,
              type: kod.type,
              file: kod.file,
              result: this.getOverAllResult(deResult, enResult, nlResult, frResult),
              de: {
                actual: deLiteral,
                expected: kod.de,
                result: deResult,
              },
              en: {
                actual: enLiteral,
                expected: kod.en,
                result: enResult,
              },
              nl: {
                actual: nlLiteral,
                expected: kod.nl,
                result: nlResult,
              },
              fr: {
                actual: frLiteral,
                expected: kod.fr,
                result: frResult,
              }
            };
            literalResults.push(litResult);
          });
          return literalResults;
        }),
        finalize(() => {
        this.blocked = false;
        this.cdr.markForCheck();
      }))
      .subscribe((response) => {
        this.translationResults = response.sort((first, second) => {
          return first.result.localeCompare(second.result);
        });
        this.exportFileName = this.fileName;
      });
  }

  private getOverAllResult(...langResults: ResultState[]): ResultState {
    let result = ResultState.pass;
    langResults.forEach((langResult) => {
      if (langResult === ResultState.fail) {
        result = ResultState.fail;
      }
    });
    return result;
  }

  private getResultState(expected: string, actual: string): ResultState {
    return encodeURIComponent(actual) === encodeURIComponent(expected) ? ResultState.pass : ResultState.fail;
  }

  private getTransLanguage(response: XLFLiterals[], lang: string, id: string): string {
    const langTransArray = response.filter((xlfLiteral) => xlfLiteral.lang === lang)
        .map((xlfLiteral) => xlfLiteral.trans);
    const langTrans = ([] as  XLFLanguage[]).concat.apply([], langTransArray);
    if (langTrans == null || langTrans.length === 0) {
      return '';
    }
    const litLang = langTrans.find((lit) => lit.id === id);
    if (litLang == null) {
      return '';
    }
    return litLang.text;
  }

  private loadTransFiles(files: BranchFile[]): Observable<XLFLiterals[]> {
    return from(files)
      .pipe(
        mergeMap((branchFile: BranchFile) => {
          return this.literalsService.getXmlToKod(branchFile);
        }),
        toArray(),
        map((response: (XLFLiterals | undefined)[]) => {
          return response.filter(
            (xlfResult: XLFLiterals | undefined) => xlfResult != null) as XLFLiterals[];
        })
      );
  }

}
