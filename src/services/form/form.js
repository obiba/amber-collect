import { feathersClient } from '../../boot/feathersClient'

export async function getForms (filter) {
  const formData = {
    query: {
      $limit: 100
    }
  }
  return feathersClient.service('crfs').find(formData)
}
