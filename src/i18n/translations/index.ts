import { LanguageCode, TranslationDictionary } from '../types';
import { en } from './en';
import { hi } from './hi';
import { bn } from './bn';
import { mr } from './mr';
import { gu } from './gu';
import { pa } from './pa';
import { or } from './or';
import { as } from './as';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  hi,
  bn,
  mr,
  gu,
  pa,
  or,
  as,
  ta,
  te,
  kn,
  ml,
};

export { en, hi, bn, mr, gu, pa, or, as, ta, te, kn, ml };
