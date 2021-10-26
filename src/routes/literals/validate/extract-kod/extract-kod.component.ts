import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, TreeNode} from 'primeng/api';
import {from, Observable} from 'rxjs';
import {finalize, mergeMap, toArray} from 'rxjs/operators';
import {Path} from '../../../../app/constants/routes.constant';
import {Branch, BranchFile} from '../../../../app/services/bitbucket-folders.service';
import {KODCode, LiteralsService} from '../../../../app/services/literals.service';
import {bytesToSize, csvJSON} from '../../../../app/utils/app.util';
import {ValidateLiteralsService} from '../validate-literals.service';

@Component({
  selector: 'app-extract-kod',
  templateUrl: './extract-kod.component.html',
  styleUrls: ['./extract-kod.component.scss']
})
export class ExtractKodComponent {
  selectedBranch: Branch | undefined;
  selectedFiles: BranchFile[] | undefined;
  blocked = false;
  showAccordion = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly literalsService: LiteralsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly validateLiteralsService: ValidateLiteralsService,
    private readonly router: Router,
  ) {
  }

  toShowAccordion(): void {
    this.showAccordion = true;
  }

  onBranchSelected(branch: Branch | undefined): void {
    this.selectedBranch = branch;
  }

  onFilesSelected(files: BranchFile[]): void {
    this.selectedFiles = files;
    this.blocked = true;
    from(this.selectedFiles).pipe(
      mergeMap((selectedFile) => {
        return this.literalsService.parseKODFromFile(selectedFile);
      }),
      toArray(),
      finalize(() => {
        this.blocked = false;
        this.cdr.markForCheck();
      }),
    ).subscribe((response) => {
      let extractedKODs: KODCode[] = [];
      response.forEach((kodCodes) => {
        extractedKODs = [...extractedKODs, ...kodCodes];
      });
      this.redirectToMapping(extractedKODs);
    });
  }

  selectedBranchFiles(branchFiles: TreeNode[]): void {
    this.validateLiteralsService.branchFiles = branchFiles;
    this.validateLiteralsService.extractedKods = undefined;
    this.validateLiteralsService.extractedKodTranslations = undefined;
  }

  uploadKODMapping(event: any, uploader: any): void {
    if (event.files == null || event.files.length === 0) {
      return;
    }
    this.getFileKODMapping(event.files[0]).subscribe((res) => {
      uploader.clear();
      this.redirectToMapping(res);
    });
  }

  convertFileSize(size: number): string {
    return bytesToSize(size);
  }

  private getFileKODMapping(file: File): Observable<KODCode[]> {
    return new Observable((observer) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target == null) {
          return;
        }
        const csvString = e.target.result as string;
        const litCodes = csvJSON(csvString).map((litCode: KODCode) => {
          if (litCode.code && litCode.code.length < 6) {
            litCode.code = '0' + litCode.code;
          }
          return litCode;
        });
        observer.next(litCodes);
        observer.complete();
      };
      fileReader.onerror = (err) => {
        observer.error(err);
        observer.complete();
      };
      fileReader.readAsText(file);
    });
  }

  private redirectToMapping(extractedKODs: KODCode[]): void {
    extractedKODs = extractedKODs
      .filter((currentKod, index, allKods) =>
        allKods.findIndex(nextKod => (nextKod.key === currentKod.key)) === index)
      .sort((a, b) => {
        if (a.type == null) {
          return -1;
        } else if (b.type == null) {
          return 1;
        } else{
          return a.type.localeCompare(b.type);
        }
      });
    this.validateLiteralsService.extractedKods = extractedKODs;
    this.validateLiteralsService.extractedKodTranslations = undefined;
    this.router.navigate([Path.literals, Path.validateLiterals, Path.validateLiterals_listKOD]);
  }
}
