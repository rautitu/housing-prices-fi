import { MUNICIPALITIES, MUNICIPALITY_POSTAL_CODES } from '../../config/postalCodes.ts';

/**
 * GET /api/municipalities
 *
 * Returns the list of available municipalities with their postal code counts.
 */
export async function getMunicipalities(): Promise<Response> {
    const result = MUNICIPALITIES.map(name => ({
        name,
        postalCodeCount: MUNICIPALITY_POSTAL_CODES[name].length,
    }));

    return Response.json(result);
}
