import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {from, Observable} from 'rxjs';
import {mergeMap, toArray} from 'rxjs/operators';
import {LiteralLanguageCodes, LiteralsService} from '../../services/literals.service';

@Component({
  selector: 'app-fetch-literals',
  templateUrl: './fetch-literals.component.html',
  styleUrls: ['./fetch-literals.component.scss']
})
export class FetchLiteralsComponent {
  @Output()
  extractedLiterals = new EventEmitter<LiteralLanguageCodes[]>();
  blocked = false;

  constructor(
    private readonly literalsService: LiteralsService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  filesSelected(files: File[]): void {
    this.blocked = true;
    from(files)
      .pipe(
        mergeMap((file: File) => {
          return this.getLiteralsFromFile(file);
        }),
        toArray(),
      )
      .subscribe((response: LiteralLanguageCodes[][]) => {
        const codes = ([] as LiteralLanguageCodes[]).concat(...response);
        this.blocked = false;
        this.cdr.detectChanges();
        this.extractedLiterals.emit(codes);
      });
  }

  private getLiteralsFromFile(file: File): Observable<LiteralLanguageCodes[]> {
    return new Observable((observer) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target == null) {
          return;
        }
        const xmlString = e.target.result as string;
        const litCodes = this.literalsService.getXMLToLiterals(xmlString);
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

}
