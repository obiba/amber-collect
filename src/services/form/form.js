import { feathersClient } from '../../boot/feathersClient'

export async function getForms (filter) {
  const formData = { query: { $sort: { descending: -1 } } }
  formData.query.$limit = 100
  // use filter
  if (filter && filter.length > 1) {
    formData.query = {
      $and: [
        {
          $or: [
            { name: { $search: filter } },
            { description: { $search: filter } }
          ]
        }
      ]
    }
  }

  return feathersClient.service('form').find(formData)
}
