import { gql } from '@apollo/client';
import _ from 'lodash'
function buildFieldList(introspectionResults, resource, raFetchType) {
  return resource.type.fields.map((m) => m.name).join('\n')
}

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
  const resource = introspectionResults.resources.find(r => r.type.name === resourceName);

  switch (raFetchType) {
  case 'GET_ONE':
    return {
      query: gql`query ${resource[raFetchType].name}($id: ID!) {
                ${resource[raFetchType].name} (id: $id) {
                   ${buildFieldList(introspectionResults, resource, raFetchType)}
                }}`,
      variables: params, // params = { id: ... }
      parseResponse: response => {
        return {
          data: response.data[resource[raFetchType].name],
        }
      },
    }
  case 'GET_LIST':
    return {
      query: gql`query { ${resource[raFetchType].name} {
                   ${buildFieldList(introspectionResults, resource, raFetchType)}
                }}`,
      variables: params, // params = { id: ... }
      parseResponse: response => {
        return {
          data: response.data[resource[raFetchType].name],
          total: 10
        }
      },
    }
  case 'UPDATE':
    const inputType = resource[raFetchType].args[0].type.ofType.name
    const validFields = _.find(introspectionResults.types, o => o.name === inputType).inputFields
    const names = _.map(validFields, o => o.name)
    const data = _.pick(params.data, names)
    const action = resource[raFetchType].name
    const responseField = resource['GET_ONE'].name

    return {
      query: gql`mutation ${action} ($data: ${inputType}!) {
        ${action} (params: $data) {
          ${responseField} {
             ${buildFieldList(introspectionResults, resource, raFetchType)}
          }
        }
      }`,
      variables: _.assign(params, { data }), // params = { id: ... }
      parseResponse: response => {
        return {
          data: response.data[action][responseField]
        }
      },
    }
  default:
    break
  }
}

export default buildQuery;
