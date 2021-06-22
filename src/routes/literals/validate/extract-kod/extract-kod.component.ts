import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {TreeNode} from 'primeng/api';
import {from} from 'rxjs';
import {finalize, mergeMap, toArray} from 'rxjs/operators';
import {Path} from '../../../../app/constants/routes.constant';
import {Branch, BranchFile} from '../../../../app/services/bitbucket-folders.service';
import {KODCode, LiteralsService} from '../../../../app/services/literals.service';
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

  constructor(
    private readonly literalsService: LiteralsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly validateLiteralsService: ValidateLiteralsService,
    private readonly router: Router,
  ) {
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
      this.redirectToMapping(extractedKODs);
    });
  }

  selectedBranchFiles(branchFiles: TreeNode[]): void {
    this.validateLiteralsService.branchFiles = branchFiles;
  }

  private redirectToMapping(extractedKODs: KODCode[]): void {
    this.validateLiteralsService.extractedKods = extractedKODs;
    this.router.navigate([Path.literals, Path.validateLiterals, Path.validateLiterals_listKOD]);
  }
}
