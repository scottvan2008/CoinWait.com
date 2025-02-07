import { i18n } from 'i18next';
import Link from 'next/link';
import { languages, languageNames } from '../../../i18n/settings';

export const LanguageBase = ({ lng, path = '' }: { i18n: i18n, lng: string, path?: string }) => {
  return (
    <div className=" text-white py-4 px-6">
      <div className="inline-flex gap-3">
        {languages
          .filter((l) => lng !== l)
          .map((l) => (
            <Link
              key={l}
              href={`/${l}${path}`}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {languageNames[l] || l}
            </Link>
          ))}
      </div>
    </div>
  );
};
