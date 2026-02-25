/**
 * Postal codes by municipality for housing price data.
 * Only includes postal codes that exist in Tilastokeskus stat.fi dataset (statfin_ashi_pxt_13mu).
 * Municipality codes from Tilastokeskus WFS (postialue:pno_tilasto_2024).
 */

/** Municipality code → name mapping */
export const MUNICIPALITY_CODES: Record<string, string> = {
    '091': 'Helsinki',
    '049': 'Espoo',
    '092': 'Vantaa',
    '837': 'Tampere',
    '604': 'Pirkkala',
    '980': 'Ylöjärvi',
    '211': 'Kangasala',
    '536': 'Nokia',
};

/** Municipality name → postal codes available in stat.fi */
export const MUNICIPALITY_POSTAL_CODES: Record<string, string[]> = {
    Helsinki: [
        '00100', '00120', '00130', '00140', '00150', '00160', '00170', '00180',
        '00200', '00210', '00220', '00240', '00250', '00260', '00270', '00280', '00290',
        '00300', '00310', '00320', '00330', '00340', '00350', '00360', '00370', '00380', '00390',
        '00400', '00410', '00420', '00430', '00440',
        '00500', '00510', '00520', '00530', '00540', '00550', '00560', '00570', '00580', '00590',
        '00600', '00610', '00620', '00630', '00640', '00650', '00660', '00670', '00680', '00690',
        '00700', '00710', '00720', '00730', '00740', '00750', '00760', '00770', '00780', '00790',
        '00800', '00810', '00820', '00830', '00840', '00850', '00870', '00880', '00890',
        '00900', '00910', '00920', '00930', '00940', '00950', '00960', '00970', '00980', '00990',
    ],
    Espoo: [
        '02100', '02110', '02120', '02130', '02140', '02150', '02160', '02170', '02180',
        '02200', '02210', '02230', '02240', '02250', '02260', '02270', '02280',
        '02300', '02320', '02330', '02340', '02360', '02380',
        '02600', '02610', '02620', '02630', '02650', '02660', '02680',
        '02710', '02720', '02730', '02740', '02750', '02760', '02770', '02780',
        '02810', '02820', '02860', '02920', '02940', '02970',
    ],
    Vantaa: [
        '01200', '01230', '01260', '01280',
        '01300', '01340', '01350', '01360', '01370', '01380', '01390',
        '01400', '01420', '01450', '01480', '01490',
        '01510', '01520', '01530',
        '01600', '01610', '01620', '01630', '01640', '01650', '01660', '01670', '01680', '01690',
        '01700', '01710', '01720', '01730', '01740', '01750', '01760',
    ],
    Tampere: [
        '33100', '33180', '33200', '33210', '33230', '33240', '33250', '33270',
        '33300', '33310', '33330', '33340',
        '33400', '33410', '33420',
        '33500', '33520', '33530', '33540', '33560', '33580',
        '33610', '33680',
        '33700', '33710', '33720', '33730',
        '33800', '33820', '33840', '33850', '33870', '33900',
        '34240', '34260',
    ],
    Pirkkala: [
        '33920', '33950', '33960', '33980',
    ],
    Ylöjärvi: [
        '33430', '33450', '33470', '33480',
        '34110', '34130', '34140',
        '34300',
        '39160', '39310', '39340',
    ],
    Kangasala: [
        '36100', '36110', '36200', '36220', '36240', '36270', '36280',
        '36420', '36430',
        '36810', '36840',
    ],
    Nokia: [
        '37100', '37120', '37130', '37140', '37150',
        '37200', '37240',
    ],
};

/** All supported municipalities (sorted) */
export const MUNICIPALITIES: string[] = Object.keys(MUNICIPALITY_POSTAL_CODES).sort();

/** All postal codes across all municipalities */
export const ALL_POSTAL_CODES: string[] = Object.values(MUNICIPALITY_POSTAL_CODES).flat().sort();

// Legacy exports for backward compatibility
export const HELSINKI_POSTAL_CODES = MUNICIPALITY_POSTAL_CODES.Helsinki;
export const ESPOO_POSTAL_CODES = MUNICIPALITY_POSTAL_CODES.Espoo;
export const VANTAA_POSTAL_CODES = MUNICIPALITY_POSTAL_CODES.Vantaa;

/** All PKS (pääkaupunkiseutu) postal codes combined */
export const PKS_POSTAL_CODES: string[] = [
    ...HELSINKI_POSTAL_CODES,
    ...ESPOO_POSTAL_CODES,
    ...VANTAA_POSTAL_CODES,
];

/** Starting year for data fetch */
export const FETCH_START_YEAR = 2018;

/**
 * Generate year range from FETCH_START_YEAR to current year (inclusive).
 * Years not available in the API will be filtered out by the extractor's validateConfig.
 */
export function generateYearRange(): string[] {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let y = FETCH_START_YEAR; y <= currentYear; y++) {
        years.push(String(y));
    }
    return years;
}

/** Default years to fetch (2018 → current year) */
export const DEFAULT_YEARS: string[] = generateYearRange();

/** Default building type codes from stat.fi */
export const DEFAULT_BUILDING_TYPES: string[] = ['1', '2', '3', '5'];

/** Default metric codes from stat.fi */
export const DEFAULT_METRICS: string[] = ['keskihinta_aritm_nw', 'lkm_julk20'];
