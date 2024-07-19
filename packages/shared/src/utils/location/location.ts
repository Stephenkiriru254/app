import { StatesList } from '@deriv/api-types';

export const getLocation = (location_list: StatesList, value: string, type: keyof StatesList[number]) => {
    if (!value || !location_list.length) return '';

    return  '';
};

// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// check if client is from EU
export const isEuCountry = (country: string) => eu_countries.includes(country);
