import userService from '../../services/user'
import { t } from '../../boot/i18n'
import { Notify } from 'quasar'

export async function forgotPassword (context, payload) {
  return userService
    .forgotPassword(payload.emailAddress)
    .then(() => {
      Notify.create({
        message: t('success.send_reset_password'),
        color: 'positive',
        icon: 'fas fa-check'
      })
    })
    .catch(err => {
      Notify.create({
        message: err.response.data.message,
        // 'There was an error processing your request. If this problem persists, contact support.',
        color: 'negative'
      })
    })
}
