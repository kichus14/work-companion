import {Injectable} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {KODCode, LiteralLanguageCodeView} from '../../../app/services/literals.service';

@Injectable()
export class ValidateLiteralsService {
  public branchFiles?: TreeNode[];
  public extractedKods?: KODCode[];
  public extractedKodTranslations?: LiteralLanguageCodeView[];
}
