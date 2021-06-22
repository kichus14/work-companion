import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {xmlToJson} from '../utils/xml.util';
import {BitbucketFoldersService, BranchFile} from './bitbucket-folders.service';

const RE_$CM = new RegExp(/\$cm(\.raw)?\((\\?['"])([^'"]+?)\2,\s?(\\?['"])([^'"]+?)\4(?:,\s?(\\?['"])(.*?)\6)?(?:,\s?\[(.+?)])?\)(?:<!--.*?-->)?/, 'g');
const RE_$CM_PLACEHOLDERS = new RegExp(/<@(\d+)>/, 'g');
const RE_$CM_PLACEHOLDERS_REPLACE = new RegExp(/(\\?['"])(.+?)\1/, 'g');
const REGEX_KOD_IDENTIFIER = new RegExp(/KOD:(LIT-KD|TXT-CD|BOOD-KD)\s([A-Z0-9]{6})(@@)([^"]*)/);
const REGEX_NO_KOD_IDENTIFIER = new RegExp(/(@@)([^"]*)/);
const REGEX_INTERPOLATION_IDENTIFIER = new RegExp(/(<x\sid=(.*?)\/>)/, 'g');

export interface LiteralCode {
  code: string;
  type: LiteralTypes;
  text?: string;
  key?: string;
  file?: BranchFile;
  pathName?: string;
}

export enum LiteralTypes {
  TXT = 'TXT-CD',
  LIT = 'LIT-KD',
  BOOD = 'BOOD-KD',
}

export interface LiteralLanguageCodes {
  type: LiteralTypes;
  codes: LiteralLanguageCode[];
}

export interface LiteralLanguageCodeView extends LiteralLanguageCode {
  type: LiteralTypes;
  key?: string;
  file?: BranchFile;
  pathName?: string;
}

export interface LiteralLanguageCode {
  id: string;
  de: string;
  en: string;
  fr: string;
  nl: string;
  validFrom: string;
  validFromDate: Date;
}

export interface KODCode {
  type?: LiteralTypes;
  code?: string;
  key: string;
}

export interface XLFLanguage {
  id: string;
  text: string;
}

export interface XLFLiterals {
  lang: string;
  trans: XLFLanguage[];
}

function replacePlaceholders(text: string, context: any, placeholderString: string): any {
  const unquoteRegex = /^\\?['"]|\\?['"]$/;
  const matches = (placeholderString.match(RE_$CM_PLACEHOLDERS_REPLACE) || []).map((matchString: string) => {
    return matchString.split(unquoteRegex).join('');
  });
  return text.replace(RE_$CM_PLACEHOLDERS, (matchString: string, index: number) => {
    if (!matches[index - 1]) {
      return matchString;
    }
    return matches[index - 1];
  });
}

@Injectable({
  providedIn: 'root'
})
export class LiteralsService {

  constructor(
    private readonly bitbucketFoldersService: BitbucketFoldersService,
  ) {
  }

  public getXmlToKod(file: BranchFile): Observable<XLFLiterals | undefined> {
    return this.bitbucketFoldersService.getFilesAt(file.repoLink, file.branch, file.path)
      .pipe(
      map((response) => {
        const xmlString = response.lines.map((line: any) => {
          let lineStr = line.text.trim();
          const matchInterpolation = lineStr.match(REGEX_INTERPOLATION_IDENTIFIER);
          if (matchInterpolation != null && matchInterpolation.length > 0) {
            matchInterpolation.forEach((currentMatch: string, index: number) => {
              lineStr = lineStr.replace(currentMatch, `[@${index + 1}]`);
            });
          }
          return lineStr.replace(/sxml/g, 'xml').replace('xmlns:xml=""', '');
        }).join('');
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(xmlString, 'application/xml');
        const xmlData = xmlToJson(xmlDom);
        const {xliff} = xmlData;
        if (xliff == null) {
          return undefined;
        }
        const {file: fileNode} = xliff;
        if (fileNode == null) {
          return undefined;
        }
        const {body, attributes} = fileNode;
        if (body == null || attributes == null) {
          return undefined;
        }
        const lang = attributes['target-language'];
        const xlfLiterals: XLFLiterals = {
          lang,
        } as XLFLiterals;
        const transUnits = body['trans-unit'];
        if (transUnits == null || transUnits.length === 0) {
          return undefined;
        }
        const langUnits: XLFLanguage[] = [];
        transUnits.forEach((transUnit: any) => {
          const {attributes: {id}, target} = transUnit;
          if (target == null) {
            return;
          }
          let {text} = target;
          if (text != null && typeof text !== 'string' && text.length != null) {
            text = text.join('');
          }
          if (text != null) {
            text = text.replace(/\s\s+/g, ' ').trim();
          }
          langUnits.push({
            id,
            text
          });
        });
        xlfLiterals.trans = langUnits;
        console.log('xlfLiterals', xlfLiterals);
        return xlfLiterals;
      })
    );
  }

  public parseKODFromFile(file: BranchFile): Observable<KODCode[]> {
    return this.bitbucketFoldersService.getFilesAt(file.repoLink, file.branch, file.path)
      .pipe(
        map((response: any) => {
          const {lines} = response;
          const kods: KODCode[] = [];
          lines.forEach((line: any) => {
            const kodMatches = line.text.match(REGEX_KOD_IDENTIFIER);
            if (kodMatches == null) {
              const noKodMatches = line.text.match(REGEX_NO_KOD_IDENTIFIER);
              if (noKodMatches != null) {
                const [fullMatch, a, key] = noKodMatches;
                kods.push({
                  key,
                });
              }
            } else {
              const [fullMatch, category, code, a, key] = kodMatches;
              kods.push({
                type: category as LiteralTypes,
                code,
                key,
              });
            }
          });
          return kods;
        }));
  }

  public parseLiteralFromFile(file: BranchFile): Observable<LiteralCode[]> {
    return this.bitbucketFoldersService.getFilesAt(file.repoLink, file.branch, file.path)
      .pipe(map((response) => {
        const {lines} = response;
        const literals: LiteralCode[] = [];
        const content = lines.map((line: any) => {
          return line.text;
        }).join(' ');
        content.replace(RE_$CM, (matchString: string,
                                 isRaw: string,
                                 q1: string,
                                 category: string,
                                 q2: string,
                                 id: string,
                                 q3: string,
                                 fallback: string,
                                 placeholderString: string) => {
          let type = LiteralTypes.LIT;
          try {
            type = category as LiteralTypes;
          } catch (err) {
          }
          literals.push({
            code: id,
            type,
            text: fallback,
            file,
          });
          return '';
        });
        return literals;
      }));
  }

  public getXMLToLiterals(xmlString: string): LiteralLanguageCodes[] {
    const parser = new DOMParser();
    const xmlDom = parser.parseFromString(xmlString, 'application/xml');
    const jsonData = xmlToJson(xmlDom);
    if (jsonData == null) {
      return [];
    }
    const {codemanager} = jsonData;
    if (codemanager == null) {
      return [];
    }
    const {codes} = codemanager;
    if (codes == null) {
      return [];
    }
    if (!Array.isArray(codes)) {
      const {attributes, code} = codes;
      return [this.getLitCodes(attributes, code)];
    }
    const litLangs: LiteralLanguageCodes[] = [];
    codes.forEach((xmlCodes) => {
      const {attributes, code} = xmlCodes;
      const litCodes = this.getLitCodes(attributes, code);
      if (litCodes != null) {
        litLangs.push(litCodes);
      }
    });
    return litLangs;
  }

  private getLitCodes(attributes: any, code: any): LiteralLanguageCodes {
    let litType: LiteralTypes = LiteralTypes.LIT;
    try {
      litType = attributes.category as LiteralTypes;
    } catch (err) {
    }
    const litCodes = code.map((litCode: any) => {
      const {attributes: {id, validFrom}, value} = litCode;
      const validFromDate = new Date(validFrom.substring(0, 4), validFrom.substring(4, 6), validFrom.substring(6, 8));
      const litLang: LiteralLanguageCode = {
        id,
        validFrom,
        validFromDate,
      } as LiteralLanguageCode;
      if (value == null || value.forEach == null) {
        return;
      }
      value.forEach((langs: any) => {
        const {attributes: {lang}} = langs;
        let {text} = langs;
        if (text != null) {
          text = text.replace(RE_$CM_PLACEHOLDERS, (regMatch: string, addValue: string) => {
            return regMatch.replace(regMatch, '[@' + addValue + ']');
          });
        }
        switch (lang as string) {
          case 'de':
            litLang.de = text;
            break;
          case 'en':
            litLang.en = text;
            break;
          case 'fr':
            litLang.fr = text;
            break;
          case 'nl':
            litLang.nl = text;
            break;
          default:
            break;
        }
      });
      return litLang;
    });
    return {
      type: litType,
      codes: litCodes,
    };
  }
}
