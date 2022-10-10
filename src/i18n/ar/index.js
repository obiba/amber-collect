// This is just an example,
// so you can safely delete all default props below

export default {
  login: {
    title: 'تسجيل الدخول لبدء الجلسة الخاصة بك',
    submit: 'تسجيل الدخول',
    forgot_password: 'هل نسيت كلمة السر؟',
    register: 'اشتراك',
    validate: 'تحقق',
    token: '6 أرقام رمزية',
    totp: 'امسح رمز الاستجابة السريعة هذا باستخدام تطبيق مصادقة متعدد العوامل (يوصى بـ Microsoft authenticator) ، ثم أدخل الرمز المميز المؤقت.',
    failed: 'بريد إلكتروني خاطئ / كلمت سر مختلطة.',
    failed_token: 'رمز غير صحيح.'
  },
  register: {
    title: 'تسجيل عضوية جديدة',
    submit: 'اشتراك',
    login: 'تسجيل الدخول',
    success: 'اكتمل التسجيل! يرجى التحقق من بريدك الإلكتروني لتأكيد تسجيلك.',
    google_policy: 'هذا الموقع محمي بواسطة reCAPTCHA وتطبق سياسة خصوصية Google ، شروط الخدمة.'
  },
  forgot_password: {
    title: 'إعادة تعيين كلمة المرور',
    hint: 'أدخل البريد الإلكتروني للحساب لإعادة تعيين كلمة المرور.',
    submit: 'إعادة ضبط',
    login: 'تسجيل الدخول'
  },
  reset: {
    title: 'إعادة تعيين كلمة المرور',
    submit: 'إعادة تعيين',
    bad_link: 'رابط إعادة تعيين كلمة المرور غير صالح. يرجى التحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور وحاول مرة أخرى.',
    failure: 'غير قادر على إعادة تعيين كلمة المرور. يرجى الاتصال بالدعم.',
    success: 'الرقم السري تغير بنجاح.'
  },
  verify: {
    title: 'التحقق من البريد الإلكتروني',
    login: 'تسجيل الدخول',
    bad_link: 'ليس رابط التحقق من البريد الإلكتروني صالحًا. يرجى التحقق من بريدك الإلكتروني للحصول على رابط التحقق وحاول مرة أخرى.',
    failure: 'غير قادر على التحقق من البريد الإلكتروني. يرجى الاتصال بالدعم.',
    success: 'شكرا ، تم التحقق من عنوان بريدك الإلكتروني.',
    pending: 'جاري التحقق من الحساب ... يرجى الانتظار ...'
  },
  locales: {
    en: 'English',
    fr: 'français',
    ar: 'العربية'
  },
  main: {
    brand: 'Amber Collect',
    brand_caption: 'نظام الإبلاغ عن الحالة',
    logout: 'خروج',
    lock: 'قفل',
    refresh: 'تحديث',
    refresh_hint: 'تحديث النماذج',
    info: 'معلومات',
    info_hint: 'معلومات التطبيق',
    source_code: 'مصدر الرمز',
    contributors: 'المساهمون',
    upgrade: 'رفع مستوى',
    upgrade_available: 'يتوفر إصدار جديد من التطبيق',
    dashboard: 'لوحة القيادة',
    case_reports: 'تقارير حالة',
    case_reports_in_progress: 'تقارير الحالة قيد التقدم',
    case_report_forms: 'نماذج تقرير الحالة',
    no_case_report_forms: 'لا يمكن العثور على نموذج للإبلاغ عن الحالات.',
    essential_links: 'الروابط',
    docs: 'توثيق',
    forum: 'المنتدى',
    powered_by: 'مشغل بواسطة',
    show_all_case_reports: 'إظهار كافة تقارير الحالة'
  },
  loading: {
    title: 'جار التحميل',
    caption: 'أرجو الإنتظار...'
  },
  lock: {
    code_placeholder: 'أدخل رمز فتح',
    new_code_placeholder: 'أدخل رمز فتح جديد',
    repeat_code_placeholder: 'كرر رمز فتح جديد',
    not_matching_codes: 'رموز فتح غير متطابقة.',
    incorrect_unclock: 'فتح رمز غير صحيح.'
  },
  error: {
    account_already_exists: 'هذا الحساب موجود بالفعل. حاول إعادة تعيين كلمة المرور الخاصة بك أو اتصل بالدعم.',
    create_account_invalid: 'معلومات الحساب غير صحيحة.',
    create_account: 'حدث خطأ أثناء إنشاء حسابك. إذا استمرت هذه المشكلة ، فاتصل بالدعم.',
    update_account: 'كان هناك خطأ أثناء تحديث ملف التعريف الخاص بك. إذا استمر هذا ، اتصل بالدعم.',
    get_case_report_forms: 'خطأ عند الحصول على نماذج تقرير الحالة.',
    save_case_report: 'فشل حفظ تقرير الحالة.',
    save_case_report_error: 'خطأ في الحفظ ، سيتم وضع تقرير الحالة قيد الانتظار حتى يتم إعادة الاتصال.',
    network_error: 'خطأ في الشبكة ، يرجى المحاولة مرة أخرى لاحقًا.'
  },
  success: {
    create_account: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني للتحقق من حسابك.',
    update_account: 'تم تحديث الحساب بنجاح.',
    send_reset_password: 'تم إرسال إعادة تعيين كلمة المرور.',
    reset_password: 'تمت إعادة تعيين كلمة المرور بنجاح.',
    update_password: 'تم تحديث كلمة المرور بنجاح.',
    send_verify_email: 'تم إرسال التحقق من البريد الإلكتروني. تحقق من البريد الإلكتروني الجديد لتحديث عنوان بريدك الإلكتروني.',
    resend_verify_email: 'استياء التحقق من البريد الإلكتروني.',
    save_case_report: 'تم حفظ تقرير الحالة.'
  },
  record: {
    state: {
      in_progress: 'قيد التقدم',
      completed: 'مكتمل',
      saved: 'تم الحفظ'
    },
    delete_record_confirm: 'يرجى تأكيد حذف السجل ، ستفقد جميع البيانات التي تم جمعها:',
    delete_saved_record_confirm: 'يرجى تأكيد حذف السجل ، تم حفظ جميع البيانات التي تم جمعها ولن تتأثر:',
    case_report_form_not_found: 'لا يمكن العثور على نموذج تقرير الحالة الذي تم استخدامه لجمع هذه البيانات.'
  },
  validations: {
    required: 'القيمة مطلوبة',
    minLength: 'الحد الأدنى للطول المطلوب هو {min}',
    maxLength: 'أقصى طول مسموح به هو {max}',
    email: 'القيمة ليست عنوان بريد إلكتروني صالحًا',
    strongPassword: 'يجب أن تحتوي كلمة المرور على واحد على الأقل من كل منها: حرف صغير ، حرف كبير ، رقم ، حرف خاص.'
  },
  license: {
    cc_by_40: '[Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)',
    cc_by_sa_40: '[Creative Commons BY SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)',
    cc_by_nc_40: '[Creative Commons BY NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)',
    cc_by_nc_sa_40: '[Creative Commons BY NC SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)',
    cc_by_nd_40: '[Creative Commons BY ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/)',
    cc_by_nc_nd_40: '[Creative Commons BY NC ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)',
    cc_cc0_10: '[Creative Commons CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)'
  },
  id: 'معرف',
  form: 'استمارة',
  data: 'بيانات',
  case_report: 'تقرير الحالة',
  email: 'البريد الإلكتروني',
  email_hint: 'عنوان بريد إلكتروني يمكن التحقق منه.',
  password: 'كلمة المرور',
  password_hint: 'إنشاء كلمة مرور. 8 أحرف كحد أدنى بأحرف صغيرة وكبيرة وأرقام وحرف خاص.',
  firstname: 'الاسم الاول',
  lastname: 'اللقب',
  preferred_language: 'اللغة المفضلة',
  required: 'مطلوب',
  cancel: 'إلغاء',
  delete: 'حذف',
  start: 'بداية',
  resume: 'سيرة ذاتية',
  view: 'نرى',
  save: 'للتسجيل',
  action: 'عمل',
  state: 'حالة',
  started_at: 'بدأت',
  updated_at: 'محدث',
  close: 'أغلق',
  go_to: 'اذهب إلى...',
  pause: 'يوقف',
  previous: 'سابق',
  next: 'التالي',
  validate_save: 'تحقق من صحة وحفظ',
  validation_errors: 'أخطاء التحقق من الصحة: {errors}',
  single_page: 'صفحة واحدة',
  multi_steps: 'خطوات متعددة',
  final_step_label: 'This is the end of the form, congratulations!',
  required_field: 'Field is required',
  go_home: 'عودة إلى الإستقبال',
  nothing_here: 'أُووبس. لا شيء هنا...'
}
