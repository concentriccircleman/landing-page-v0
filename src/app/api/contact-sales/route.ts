import { countryOptions } from "@/lib/country-options";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactSalesWebhookPayload {
  workEmail: string;
  firstName: string;
  lastName: string;
  company: string;
  companySize: string;
  country: string;
  heardAboutUs: string;
  heardAboutUsOther: string;
  motivations: string;
}

interface AttioListAttribute {
  id?: {
    attribute_id?: string;
  };
  title?: string;
  api_slug?: string;
  type?: string;
  is_multiselect?: boolean;
}

interface AttioRecordId {
  record_id?: string;
}

interface AttioRecordResponse {
  data?: {
    id?: AttioRecordId;
  };
}

interface AttioAttributeValuesResponse {
  data?: unknown[];
}

interface AttioListAttributesResponse {
  data?: AttioListAttribute[];
}

interface ContactSalesWebhookResponse {
  ok: boolean;
  error?: string;
}

const HEARD_ABOUT_US_OTHER_OPTION = "Other";


interface ContactSalesMetadataResponse {
  companySizeOptions: string[];
  countryInputMode: "location" | "select" | "text";
  countryOptions: string[];
}

interface AttioSelectOptionResponse {
  data?: Array<{
    title?: string;
    is_archived?: boolean;
  }>;
}

interface AttioCompanyRecordQueryResponse {
  data?: Array<{
    id?: {
      record_id?: string;
    };
  }>;
}

const getRequiredEnvValue = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const readJsonBody = async (request: Request): Promise<unknown | null> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const createErrorResponse = (status: number, error: string) =>
  Response.json(
    { ok: false, error } satisfies ContactSalesWebhookResponse,
    { status, headers: { "Cache-Control": "no-store" } },
  );

const postAttioJson = async (input: RequestInfo, init: RequestInit) => {
  const response = await fetch(input, init);
  const responseText = await response.text();

  let parsedJson: unknown = null;
  try {
    parsedJson = responseText ? JSON.parse(responseText) : null;
  } catch {
    parsedJson = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof parsedJson === "object" && parsedJson && "error" in parsedJson
        ? String((parsedJson as { error?: unknown }).error)
        : responseText || `Attio request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return parsedJson;
};

const getOptionalString = (value: unknown) => (typeof value === "string" ? value : null);

const getListEntryIdFromResponse = (responseBody: unknown) => {
  if (!responseBody || typeof responseBody !== "object") return null;
  const data = (responseBody as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const id = (data as { id?: unknown }).id;
  if (!id || typeof id !== "object") return null;
  return getOptionalString((id as { entry_id?: unknown }).entry_id);
};

const getAttioListAttributes = async (
  listId: string,
  commonHeaders: HeadersInit,
): Promise<AttioListAttribute[]> => {
  const attributesResponse = (await postAttioJson(`https://api.attio.com/v2/lists/${listId}/attributes`, {
    method: "GET",
    headers: commonHeaders,
  })) as AttioListAttributesResponse;

  return Array.isArray(attributesResponse?.data) ? attributesResponse.data : [];
};

const findListAttributeByTitle = (
  listAttributes: AttioListAttribute[],
  title: string,
): AttioListAttribute | null => {
  const normalizedTitle = normalizeKey(title);
  return (
    listAttributes.find((attribute) => {
      const attributeTitle = attribute.title;
      const apiSlug = attribute.api_slug;
      if (attributeTitle && normalizeKey(attributeTitle) === normalizedTitle) return true;
      if (apiSlug && normalizeKey(apiSlug) === normalizedTitle) return true;
      return false;
    }) ?? null
  );
};

const getAttioSelectOptionTitles = async (
  listId: string,
  attributeIdOrSlug: string,
  commonHeaders: HeadersInit,
) => {
  const optionsResponse = (await postAttioJson(
    `https://api.attio.com/v2/lists/${listId}/attributes/${attributeIdOrSlug}/options`,
    { method: "GET", headers: commonHeaders },
  )) as AttioSelectOptionResponse;

  const options = Array.isArray(optionsResponse?.data) ? optionsResponse.data : [];
  return options
    .filter((option) => option && option.is_archived !== true && typeof option.title === "string")
    .map((option) => option.title as string);
};

const getCountryNameFromCode = (countryCode: string) => {
  const countryOption = countryOptions.find(
    (innerCountryOption) => innerCountryOption.code.toUpperCase() === countryCode.toUpperCase(),
  );
  return countryOption?.name ?? null;
};

const getCountryCodeFromName = (countryName: string) => {
  const normalizedName = normalizeKey(countryName);
  const countryOption = countryOptions.find(
    (innerCountryOption) => normalizeKey(innerCountryOption.name) === normalizedName,
  );
  return countryOption?.code ?? null;
};

const findOrCreateCompanyByName = async (
  companyName: string,
  commonHeaders: HeadersInit,
): Promise<string | null> => {
  const queryResponse = (await postAttioJson("https://api.attio.com/v2/objects/companies/records/query", {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({ filter: { name: companyName }, limit: 1 }),
  })) as AttioCompanyRecordQueryResponse;

  const existingRecordId = queryResponse?.data?.[0]?.id?.record_id ?? null;
  if (existingRecordId) return existingRecordId;

  const createResponse = (await postAttioJson("https://api.attio.com/v2/objects/companies/records", {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({
      data: {
        values: {
          name: [{ value: companyName }],
        },
      },
    }),
  })) as AttioRecordResponse;

  return createResponse?.data?.id?.record_id ?? null;
};

const createLocationValue = (
  countryCode: string,
  displayLabel: string | null,
): {
  line_1: string | null;
  line_2: string | null;
  line_3: string | null;
  line_4: string | null;
  locality: string | null;
  region: string | null;
  postcode: string | null;
  country_code: string;
  latitude: string | null;
  longitude: string | null;
} => ({
  line_1: displayLabel,
  line_2: null,
  line_3: null,
  line_4: null,
  locality: null,
  region: null,
  postcode: null,
  country_code: countryCode,
  latitude: null,
  longitude: null,
});

export const GET = async () => {
  let attioApiToken: string;
  let attioContactSalesListId: string;

  try {
    attioApiToken = getRequiredEnvValue("ATTIO_API_TOKEN");
    attioContactSalesListId = getRequiredEnvValue("ATTIO_CONTACT_SALES_LIST_ID");
  } catch (error) {
    return createErrorResponse(500, error instanceof Error ? error.message : "Missing required environment variables.");
  }

  const commonHeaders: HeadersInit = {
    Authorization: `Bearer ${attioApiToken}`,
    Accept: "application/json",
  };

  let listAttributes: AttioListAttribute[] = [];
  try {
    listAttributes = await getAttioListAttributes(attioContactSalesListId, commonHeaders);
  } catch (error) {
    return createErrorResponse(
      502,
      error instanceof Error ? error.message : "Failed to fetch Attio list attributes.",
    );
  }

  const companySizeAttribute = findListAttributeByTitle(listAttributes, "Company Size");
  const countryAttribute = findListAttributeByTitle(listAttributes, "Country");

  const companySizeAttributeId = companySizeAttribute?.id?.attribute_id ?? companySizeAttribute?.api_slug ?? null;
  const countryAttributeId = countryAttribute?.id?.attribute_id ?? countryAttribute?.api_slug ?? null;

  let companySizeOptions: string[] = [];
  if (companySizeAttributeId && companySizeAttribute?.type === "select") {
    try {
      companySizeOptions = await getAttioSelectOptionTitles(
        attioContactSalesListId,
        companySizeAttributeId,
        commonHeaders,
      );
    } catch {
      companySizeOptions = [];
    }
  }

  let countryInputMode: ContactSalesMetadataResponse["countryInputMode"] = "text";
  let countryOptions: string[] = [];

  if (countryAttribute?.type === "location") {
    countryInputMode = "location";
  } else if (countryAttribute?.type === "select" && countryAttributeId) {
    countryInputMode = "select";
    try {
      countryOptions = await getAttioSelectOptionTitles(
        attioContactSalesListId,
        countryAttributeId,
        commonHeaders,
      );
    } catch {
      countryOptions = [];
    }
  }

  return Response.json(
    { companySizeOptions, countryInputMode, countryOptions } satisfies ContactSalesMetadataResponse,
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
};

const isContactSalesWebhookPayload = (value: unknown): value is ContactSalesWebhookPayload => {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  const stringFields: Array<keyof ContactSalesWebhookPayload> = [
    "workEmail",
    "firstName",
    "lastName",
    "company",
    "companySize",
    "country",
    "heardAboutUs",
    "heardAboutUsOther",
    "motivations",
  ];

  return stringFields.every((field) => typeof payload[field] === "string");
};

export const POST = async (request: Request) => {
  let attioApiToken: string;
  let attioContactSalesListId: string;

  try {
    attioApiToken = getRequiredEnvValue("ATTIO_API_TOKEN");
    attioContactSalesListId = getRequiredEnvValue("ATTIO_CONTACT_SALES_LIST_ID");
  } catch (error) {
    return createErrorResponse(500, error instanceof Error ? error.message : "Missing required environment variables.");
  }

  const body = await readJsonBody(request);
  if (!isContactSalesWebhookPayload(body)) {
    return createErrorResponse(400, "Invalid payload.");
  }

  const trimmedPayload: ContactSalesWebhookPayload = {
    workEmail: body.workEmail.trim(),
    firstName: body.firstName.trim(),
    lastName: body.lastName.trim(),
    company: body.company.trim(),
    companySize: body.companySize.trim(),
    country: body.country.trim(),
    heardAboutUs: body.heardAboutUs.trim(),
    heardAboutUsOther: body.heardAboutUsOther.trim(),
    motivations: body.motivations.trim(),
  };

  if (
    !trimmedPayload.workEmail ||
    !trimmedPayload.firstName ||
    !trimmedPayload.lastName ||
    !trimmedPayload.company ||
    !trimmedPayload.companySize ||
    !trimmedPayload.country ||
    !trimmedPayload.heardAboutUs ||
    !trimmedPayload.motivations
  ) {
    return createErrorResponse(400, "All fields are required.");
  }

  if (trimmedPayload.heardAboutUs === HEARD_ABOUT_US_OTHER_OPTION && !trimmedPayload.heardAboutUsOther) {
    return createErrorResponse(400, "Please specify how you heard about us.");
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedPayload.workEmail);
  if (!emailLooksValid) {
    return createErrorResponse(400, "Work Email is not a valid email address.");
  }

  const commonHeaders: HeadersInit = {
    Authorization: `Bearer ${attioApiToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let companyRecordId: string | null = null;
  try {
    companyRecordId = await findOrCreateCompanyByName(trimmedPayload.company, commonHeaders);
  } catch {
    // Non-fatal: company linking is best-effort
  }

  let personRecordId: string | null = null;
  try {
    const personResponse = (await postAttioJson(
      "https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses",
      {
        method: "PUT",
        headers: commonHeaders,
        body: JSON.stringify({
          data: {
            values: {
              email_addresses: [trimmedPayload.workEmail],
              name: [
                {
                  first_name: trimmedPayload.firstName,
                  last_name: trimmedPayload.lastName,
                  full_name: `${trimmedPayload.firstName} ${trimmedPayload.lastName}`.trim(),
                },
              ],
              ...(companyRecordId
                ? { company: [{ target_record_id: companyRecordId, target_object: "companies" }] }
                : {}),
            },
          },
        }),
      },
    )) as AttioRecordResponse;

    personRecordId = personResponse?.data?.id?.record_id ?? null;
    if (!personRecordId) {
      return createErrorResponse(502, "Attio did not return a person record id.");
    }
  } catch (error) {
    return createErrorResponse(502, error instanceof Error ? error.message : "Failed to upsert person in Attio.");
  }

  let listAttributes: AttioListAttribute[] = [];
  try {
    listAttributes = await getAttioListAttributes(attioContactSalesListId, commonHeaders);
  } catch (error) {
    return createErrorResponse(
      502,
      error instanceof Error ? error.message : "Failed to fetch Attio list attributes.",
    );
  }

  const entryValues: Record<string, unknown> = {};
  let countryListAttributeIdentifierForReadBack: string | null = null;

  const companySizeListAttribute = findListAttributeByTitle(listAttributes, "Company Size");
  const motivationsListAttribute = findListAttributeByTitle(listAttributes, "Motivations");
  const heardAboutUsListAttribute = findListAttributeByTitle(listAttributes, "Hear");

  const allCountryListAttributes = listAttributes.filter((attribute) => {
    const normalizedTitle = attribute.title ? normalizeKey(attribute.title) : "";
    const normalizedSlug = attribute.api_slug ? normalizeKey(attribute.api_slug) : "";
    return normalizedTitle === "country" || normalizedSlug.startsWith("country");
  });

  // country_6 exists because this Attio list has multiple "Country" columns; Attio disambiguates slugs by suffixing (_6).
  const preferredCountryListAttribute =
    allCountryListAttributes.find((attribute) => attribute.api_slug === "country_6") ??
    allCountryListAttributes.find((attribute) => attribute.api_slug === "country") ??
    allCountryListAttributes[0] ??
    null;

  const countryListAttributes = preferredCountryListAttribute ? [preferredCountryListAttribute] : [];

  if (!companySizeListAttribute || !motivationsListAttribute || countryListAttributes.length === 0) {
    const missingRequiredColumnTitles: string[] = [];

    if (!companySizeListAttribute) missingRequiredColumnTitles.push("Company Size");
    if (!motivationsListAttribute) missingRequiredColumnTitles.push("Motivations");
    if (countryListAttributes.length === 0) missingRequiredColumnTitles.push("Country (or Location)");

    return createErrorResponse(
      500,
      `Attio list is missing columns: ${missingRequiredColumnTitles.join(", ")}.`,
    );
  }

  const writeAttributeValue = async (attribute: AttioListAttribute, incomingValue: string, columnTitle: string) => {
    const attributeIdentifier = attribute.api_slug ?? attribute.id?.attribute_id ?? null;
    const attributeIdentifierForReadBack = attribute.id?.attribute_id ?? attribute.api_slug ?? null;

    if (!attributeIdentifier || !attributeIdentifierForReadBack) {
      return createErrorResponse(500, `Attio list column is missing an identifier: ${columnTitle}.`);
    }

    const attributeType = attribute.type ?? "text";
    const normalizedColumnTitle = normalizeKey(columnTitle);
    const isCountryLikeColumn =
      normalizedColumnTitle.includes("country") || normalizedColumnTitle.includes("location");

    if (attributeType === "location") {
      const upperValue = incomingValue.toUpperCase();
      const countryCode = /^[A-Z]{2}$/.test(upperValue) ? upperValue : getCountryCodeFromName(incomingValue);

      if (!countryCode) {
        return createErrorResponse(
          400,
          "Country must be an ISO 3166-1 alpha-2 code (example: CA) or a recognizable country name.",
        );
      }

      const attributeIdForWrite = attribute.id?.attribute_id ?? attributeIdentifier;
      const countryName = getCountryNameFromCode(countryCode) ?? null;
      entryValues[attributeIdForWrite] = [createLocationValue(countryCode, countryName)];

      const shouldPreferAsReadBack = countryListAttributeIdentifierForReadBack === null || attributeType === "location";
      if (shouldPreferAsReadBack) {
        countryListAttributeIdentifierForReadBack = attributeIdentifierForReadBack;
      }

      return null;
    }

    if (attributeType === "select") {
      try {
        const optionTitles = await getAttioSelectOptionTitles(
          attioContactSalesListId,
          attributeIdentifierForReadBack,
          commonHeaders,
        );
        const isValidOption = optionTitles.some(
          (optionTitle) => normalizeKey(optionTitle) === normalizeKey(incomingValue),
        );

        if (!isValidOption) {
          const suggestedOptions = optionTitles.length > 0 ? ` Valid options: ${optionTitles.join(", ")}.` : "";
          return createErrorResponse(400, `${columnTitle} is not a valid option.${suggestedOptions}`);
        }
      } catch {
        return createErrorResponse(502, `Failed to validate ${columnTitle} options in Attio.`);
      }
    }

    if (isCountryLikeColumn) {
      const upperCountryCode = incomingValue.toUpperCase();
      const countryName = /^[A-Z]{2}$/.test(upperCountryCode) ? getCountryNameFromCode(upperCountryCode) : null;
      entryValues[attributeIdentifier] = countryName ?? incomingValue;
    } else {
      entryValues[attributeIdentifier] = incomingValue;
    }

    if (isCountryLikeColumn) {
      if (!countryListAttributeIdentifierForReadBack) {
        countryListAttributeIdentifierForReadBack = attributeIdentifierForReadBack;
      }
    }

    return null;
  };

  {
    const attributeIdentifier =
      companySizeListAttribute.api_slug ?? companySizeListAttribute.id?.attribute_id ?? null;
    const attributeIdentifierForReadBack =
      companySizeListAttribute.id?.attribute_id ?? companySizeListAttribute.api_slug ?? null;

    if (!attributeIdentifier || !attributeIdentifierForReadBack) {
      return createErrorResponse(500, "Attio list column is missing an identifier: Company Size.");
    }

    if ((companySizeListAttribute.type ?? "text") === "select") {
      try {
        const optionTitles = await getAttioSelectOptionTitles(
          attioContactSalesListId,
          attributeIdentifierForReadBack,
          commonHeaders,
        );
        const isValidOption = optionTitles.some(
          (optionTitle) => normalizeKey(optionTitle) === normalizeKey(trimmedPayload.companySize),
        );

        if (!isValidOption) {
          const suggestedOptions = optionTitles.length > 0 ? ` Valid options: ${optionTitles.join(", ")}.` : "";
          return createErrorResponse(400, `Company Size is not a valid option.${suggestedOptions}`);
        }
      } catch {
        return createErrorResponse(502, "Failed to validate Company Size options in Attio.");
      }
    }

    entryValues[attributeIdentifier] = trimmedPayload.companySize;
  }

  {
    const attributeIdentifier =
      motivationsListAttribute.api_slug ?? motivationsListAttribute.id?.attribute_id ?? null;
    if (!attributeIdentifier) {
      return createErrorResponse(500, "Attio list column is missing an identifier: Motivations.");
    }

    entryValues[attributeIdentifier] = trimmedPayload.motivations;
  }

  if (heardAboutUsListAttribute) {
    const attributeIdentifier =
      heardAboutUsListAttribute.api_slug ?? heardAboutUsListAttribute.id?.attribute_id ?? null;
    if (!attributeIdentifier) {
      return createErrorResponse(500, "Attio list column is missing an identifier: How did you hear about us?.");
    }

    const heardAboutUsValue =
      trimmedPayload.heardAboutUs === HEARD_ABOUT_US_OTHER_OPTION
        ? trimmedPayload.heardAboutUsOther
        : trimmedPayload.heardAboutUs;
    entryValues[attributeIdentifier] = heardAboutUsValue;
  }

  for (const countryListAttribute of countryListAttributes) {
    const columnTitle = countryListAttribute.title ?? countryListAttribute.api_slug ?? "Country";
    const writeResult = await writeAttributeValue(countryListAttribute, trimmedPayload.country, columnTitle);
    if (writeResult) return writeResult;
  }

  let listEntryId: string | null = null;
  try {
    const listEntryResponseBody = await postAttioJson(
      `https://api.attio.com/v2/lists/${attioContactSalesListId}/entries`,
      {
        method: "PUT",
        headers: commonHeaders,
        body: JSON.stringify({
          data: {
            parent_record_id: personRecordId,
            parent_object: "people",
            entry_values: entryValues,
          },
        }),
      },
    );
    listEntryId = getListEntryIdFromResponse(listEntryResponseBody);

    if (!listEntryId) {
      return createErrorResponse(
        502,
        "Attio did not return a list entry id; cannot verify saved values.",
      );
    }
  } catch (error) {
    return createErrorResponse(
      502,
      error instanceof Error ? error.message : "Failed to upsert Attio list entry.",
    );
  }

  if (countryListAttributeIdentifierForReadBack && listEntryId) {
    try {
      const countryValuesResponse = (await postAttioJson(
        `https://api.attio.com/v2/lists/${attioContactSalesListId}/entries/${listEntryId}/attributes/${countryListAttributeIdentifierForReadBack}/values`,
        { method: "GET", headers: commonHeaders },
      )) as AttioAttributeValuesResponse;

      const values = Array.isArray(countryValuesResponse?.data) ? countryValuesResponse.data : [];
      if (values.length === 0) {
        return createErrorResponse(
          502,
          "Attio accepted the request, but Country was not persisted on the list entry. This usually means the Country column is a location attribute and must be written as an array containing a full location object (country_code + other fields, even if null).",
        );
      }
    } catch (error) {
      return createErrorResponse(
        502,
        error instanceof Error ? error.message : "Failed to read back Country value from Attio.",
      );
    }
  }

  return Response.json(
    {
      ok: true,
    } satisfies ContactSalesWebhookResponse,
    { status: 200 },
  );
};

