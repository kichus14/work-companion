import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {from} from 'rxjs';
import {finalize, mergeMap, toArray} from 'rxjs/operators';
import {Path} from '../../../../app/constants/routes.constant';
import {Branch, BranchFile} from '../../../../app/services/bitbucket-folders.service';
import {LiteralCode, LiteralsService} from '../../../../app/services/literals.service';
import {ExtractLiteralsService} from '../extract-literals.service';

@Component({
  selector: 'app-extract-codes',
  templateUrl: './fetch-codes.component.html',
  styleUrls: ['./fetch-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FetchCodesComponent {
  selectedBranch: Branch | undefined;
  selectedFiles: BranchFile[] | undefined;
  blocked = false;
  filesTabActive = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly extractLiteralsService: ExtractLiteralsService,
    private readonly literalsService: LiteralsService,
    private readonly router: Router,
  ) {
    // this.redirectToValidate(MOCK_LITERALS);
  }

  onBranchSelected(branch: Branch | undefined): void {
    this.selectedBranch = branch;
    this.filesTabActive = true;
    this.cdr.markForCheck();
  }

  selectBranchTabChange(event: any): void {
    this.filesTabActive = !event;
  }

  onFilesSelected(files: BranchFile[]): void {
    this.selectedFiles = files;
    if (this.selectedFiles == null) {
      return;
    }
    this.blocked = true;
    let literalCodes: LiteralCode[] = [];
    from(this.selectedFiles).pipe(
      mergeMap((selectedFile) => {
        return this.literalsService.parseLiteralFromFile(selectedFile);
      }),
      toArray(),
      finalize(() => {
        this.blocked = false;
        this.cdr.markForCheck();
      }),
    ).subscribe((response) => {
      response.forEach((literals) => {
        literalCodes = [...literalCodes, ...literals];
      });
      literalCodes = literalCodes
        .filter((currentLiteral, index, allLiterals) =>
          allLiterals.findIndex(nextLiteral => (nextLiteral.code === currentLiteral.code)) === index)
          .map((literalCode) => {
            if (literalCode.file != null && literalCode.file.parent !== '') {
              literalCode.file.parent.split('/').reverse().reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
                if (previousValue != null && previousValue.toLowerCase() === 'views') {
                  literalCode.pathName = currentValue;
                }
                return '';
                });
            }
            return literalCode;
          })
        .sort((a, b) => {
          if (a.pathName != null && b.pathName != null) {
            return a.pathName.localeCompare(b.pathName);
          } else if (a.pathName != null) {
            return 1;
          }
          else {
            return -1;
          }
        });
      this.redirectToValidate(literalCodes);
    });
  }

  private redirectToValidate(literalCodes: LiteralCode[]): void {
    this.extractLiteralsService.legacyLiteralCodes = literalCodes;
    this.router.navigate([Path.literals, Path.extractLiterals, Path.extractLiterals_ValidateCodes]);
  }
}
