import {LiteralCode, LiteralLanguageCode, LiteralLanguageCodes, LiteralLanguageCodeView} from '../services/literals.service';

export const getLiteralMapping =
  (legacyLiteralCodes: any,
   legacyLiteralLanguages: LiteralLanguageCodes[])
    : LiteralLanguageCodeView[] => {
    return legacyLiteralCodes.map((legacyCode: LiteralCode) => {
      let litLangCode = {
        key: legacyCode.key,
        file: legacyCode.file,
        pathName: legacyCode.pathName,
      } as LiteralLanguageCodeView;
      if (legacyCode.type == null || legacyCode.code == null) {
        return litLangCode;
      }
      litLangCode = {
        ...litLangCode,
        type: legacyCode.type,
        id: legacyCode.code
      };
      const currentTypeLits = legacyLiteralLanguages.filter((language: LiteralLanguageCodes) => {
        return language.type === legacyCode.type;
      });
      if (currentTypeLits != null && currentTypeLits.length > 0) {
        const currentTypesCodes = currentTypeLits.map((currentTypeLit) => {
          return currentTypeLit.codes;
        });
        const currentTypeCodes = ([] as LiteralLanguageCode[]).concat(...currentTypesCodes);
        const existingCodes = currentTypeCodes.filter((typeCode) => {
          return typeCode != null && typeCode.id === legacyCode.code;
        });
        if (existingCodes.length === 0) {
          return litLangCode;
        }
        const validLiteralCode = existingCodes.reduce((firstCode, secondCode) => {
          return firstCode.validFromDate > secondCode.validFromDate ? firstCode : secondCode;
        });
        return {
          ...litLangCode,
          ...validLiteralCode,
        };
      }
      return litLangCode;
    });
};
