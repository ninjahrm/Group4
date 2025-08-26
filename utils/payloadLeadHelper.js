import{testLeadData} from '../testdata/apitestdata/LeadData/POSTData.js'

export function getLeadPayload(overrides = {}, omit = []) {
  // deep clone base payload so original is not mutated
  let payload = JSON.parse(JSON.stringify(testLeadData.Leaddatapayload));

  // apply overrides
  payload = { ...payload, ...overrides };

  // remove fields if needed
  for (const field of omit) {
    delete payload[field];
  }

  return payload;
}