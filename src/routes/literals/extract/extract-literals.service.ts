import {Injectable} from '@angular/core';
import {LiteralCode, LiteralLanguageCodes} from '../../../app/services/literals.service';

@Injectable()
export class ExtractLiteralsService {
  public legacyLiteralCodes?: LiteralCode[];
  public legacyLiteralLanguages?: LiteralLanguageCodes[];
}
