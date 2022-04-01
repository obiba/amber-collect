import userService from '../../services/user'
import { t } from '../../boot/i18n'
import { errorHandler } from '../../boot/errors'
import { Notify } from 'quasar'

export async function registerUser (context, payload) {
  const result = await userService
    .register(
      payload.formData.firstname,
      payload.formData.lastname,
      payload.formData.language,
      payload.formData.email,
      payload.formData.password,
      payload.formData.token
    )
    .catch(err => {
      if (err.response) {
        const errorCode = err.response.data.code
        if (errorCode === 409) {
          Notify.create({
            message: t('error.account_already_exists'),
            color: 'negative'
          })
        } else if (errorCode === 400) {
          errorHandler.onError(err.response.data, t('error.create_account_invalid'))
        } else {
          Notify.create({
            message: t('error.create_account'),
            color: 'negative'
          })
        }
      }
    })
  if (result && result.status >= 201) {
    Notify.create({
      message: t('success.create_account'),
      color: 'positive'
    })
    this.$router.push('/login')
  }
}

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
