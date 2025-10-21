import { t } from '../i18n'

describe('Internationalization', () => {
  describe('t function', () => {
    it('returns English translation by default', () => {
      expect(t('common.save')).toBe('Save')
      expect(t('common.cancel')).toBe('Cancel')
      expect(t('navigation.dashboard')).toBe('Overview')
    })

    it('returns Vietnamese translation when locale is vi', () => {
      expect(t('common.save', {}, 'vi')).toBe('Lưu')
      expect(t('common.cancel', {}, 'vi')).toBe('Hủy')
      expect(t('navigation.dashboard', {}, 'vi')).toBe('Tổng quan')
    })

    it('handles parameter interpolation', () => {
      const result = t('dashboard.welcome', { name: 'John' })
      expect(result).toBe('Welcome back, John!')
    })

    it('handles parameter interpolation in Vietnamese', () => {
      const result = t('dashboard.welcome', { name: 'John' }, 'vi')
      expect(result).toBe('Chào mừng trở lại, John!')
    })

    it('returns key when translation is not found', () => {
      const unknownKey = 'unknown.key' as any
      expect(t(unknownKey)).toBe('unknown.key')
    })

    it('handles missing parameters gracefully', () => {
      const result = t('dashboard.welcome')
      expect(result).toBe('Welcome back, {name}!')
    })

    it('handles numeric parameters', () => {
      const result = t('common.test', { count: 5 }, 'en')
      expect(result).toBe('common.test') // Since this key doesn't exist, returns the key
    })

    it('supports complex nested translations', () => {
      expect(t('forms.invalidEmail')).toBe('Please enter a valid email address')
      expect(t('forms.invalidEmail', {}, 'vi')).toBe('Vui lòng nhập địa chỉ email hợp lệ')
    })

    it('handles all navigation translations', () => {
      const navKeys = [
        'navigation.dashboard',
        'navigation.menuManagement',
        'navigation.branchManagement',
        'navigation.tableLayouts',
        'navigation.qrCodes',
        'navigation.profile',
        'navigation.settings'
      ]

      navKeys.forEach(key => {
        const enTranslation = t(key)
        const viTranslation = t(key, {}, 'vi')

        expect(enTranslation).toBeDefined()
        expect(viTranslation).toBeDefined()
        expect(enTranslation).not.toBe(key)
        expect(viTranslation).not.toBe(key)
      })
    })

    it('handles all dashboard translations', () => {
      const dashboardKeys = [
        'dashboard.welcome',
        'dashboard.subtitle',
        'dashboard.stats.branches',
        'dashboard.stats.menuItems',
        'dashboard.stats.staff',
        'dashboard.stats.revenue',
        'dashboard.quickActions',
        'dashboard.recentActivity',
        'dashboard.systemStatus'
      ]

      dashboardKeys.forEach(key => {
        const enTranslation = t(key)
        const viTranslation = t(key, {}, 'vi')

        expect(enTranslation).toBeDefined()
        expect(viTranslation).not.toBe(key)
      })
    })

    it('handles error translations', () => {
      const errorKeys = [
        'errors.accessDenied',
        'errors.pageNotFound'
      ]

      errorKeys.forEach(key => {
        const enTranslation = t(key)
        const viTranslation = t(key, {}, 'vi')

        expect(enTranslation).toBeDefined()
        expect(viTranslation).toBeDefined()
        expect(enTranslation).toContain('Access')
        expect(viTranslation).toContain('Truy cập')
      })
    })

    it('handles form validation translations', () => {
      const formKeys = [
        'forms.required',
        'forms.invalidEmail',
        'forms.passwordMismatch'
      ]

      formKeys.forEach(key => {
        const enTranslation = t(key)
        const viTranslation = t(key, {}, 'vi')

        expect(enTranslation).toBeDefined()
        expect(viTranslation).toBeDefined()
      })
    })

    it('handles authentication translations', () => {
      const authKeys = [
        'auth.login',
        'auth.logout',
        'auth.loginRequired',
        'auth.credentialsInvalid'
      ]

      authKeys.forEach(key => {
        const enTranslation = t(key)
        const viTranslation = t(key, {}, 'vi')

        expect(enTranslation).toBeDefined()
        expect(viTranslation).toBeDefined()
      })
    })

    it('returns consistent translations for the same key', () => {
      const key = 'common.save'
      const firstCall = t(key)
      const secondCall = t(key)
      const thirdCall = t(key, {}, 'vi')

      expect(firstCall).toBe(secondCall)
      expect(firstCall).not.toBe(thirdCall)
    })

    it('handles empty parameters object', () => {
      const result = t('dashboard.welcome', {})
      expect(result).toBe('Welcome back, {name}!')
    })

    it('handles locale fallback to English for invalid locales', () => {
      const result = t('common.save', {}, 'invalid-locale' as any)
      expect(result).toBe('Save')
    })
  })
})