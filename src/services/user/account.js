import { api } from '../../boot/axios'

export async function forgotPassword (email) {
  return api.post('/authManagement', {
    action: 'sendResetPwd',
    value: { email: email }
  })
}
