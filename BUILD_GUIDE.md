# BUILD_GUIDE.md

## 🚀 Публикация JustLEarn на App Store и Google Play через Expo

Этот гайд поможет вам опубликовать приложение JustLEarn на обеих платформах с минимальными усилиями.

---

## Шаг 1: Базовая подготовка (5 минут)

```bash
# 1. Установите Expo CLI и EAS CLI
npm install -g expo-cli eas-cli

# 2. Создайте аккаунт на https://expo.dev и авторизуйтесь
eas login

# 3. Установите зависимости проекта
npm install

# 4. Инициализируйте EAS в проекте
eas build:configure
```

---

## Шаг 2: Аккаунты разработчика

### Apple (App Store)
- Создайте или используйте **Apple ID**: https://appleid.apple.com/account
- Запишитесь в **Apple Developer Program** ($99/год): https://developer.apple.com/programs/
- Включите **двухфакторную аутентификацию** на вашем Apple ID

### Google (Google Play)
- Создайте **Google Play Developer Account** (разовый взнос $25): https://play.google.com/console/

---

## Шаг 3: Публикация одной командой

### iOS (App Store)
```bash
# Собрать и загрузить на App Store автоматически
eas build --platform ios --auto-submit

# Что будет запрошено:
# - Email и пароль Apple ID
# - Двухфакторный код из SMS
```

### Android (Google Play)
```bash
# Собрать и загрузить на Google Play автоматически
eas build --platform android --auto-submit
```

### Обе платформы
```bash
eas build --platform all
```

---

## Шаг 4: Заполните данные в браузере

### App Store Connect
Откройте: https://appstoreconnect.apple.com/

Заполните:
- ✏️ **Скриншоты** (2–10 штук, размер 1242 × 2208 px для iPhone)
- ✏️ **Название** приложения (до 30 символов)
- ✏️ **Описание** (что делает приложение, до 4000 символов)
- ✏️ **Ключевые слова** (learning, education, flashcards и т.д.)
- ✏️ **Категория** → Education
- ✏️ **Рейтинг контента** (нажмите кнопку и заполните анкету)
- ✏️ **Privacy Policy URL** (ссылка на ваш `PRIVACY_POLICY.md`)

### Google Play Console
Откройте: https://play.google.com/console/

Заполните аналогичные поля + обязательно добавьте:
- ✏️ **Основной скриншот** и функциональное изображение (1024 × 500 px)
- ✏️ **Краткое описание** (до 80 символов)

---

## Шаг 5: Отправьте на ревью (1 клик)

**App Store Connect:** нажмите **"Submit for Review"**
**Google Play Console:** нажмите **"Review and publish"**

Ожидание:
- **App Store**: обычно 24–48 часов
- **Google Play**: обычно 1–3 дней

---

## Шаг 6: Обновление приложения

```bash
# Собрать новую версию (предварительно обновите "version" в app.json)
eas build --platform all

# Загрузить на магазины
eas submit --platform ios
eas submit --platform android
```

---

## Быстрые команды

| Команда | Описание |
|---------|----------|
| `npm start` | Запустить локально (нажмите `i` для iOS, `a` для Android) |
| `eas build --platform ios` | Собрать для iOS |
| `eas build --platform android` | Собрать для Android |
| `eas submit --platform ios` | Загрузить на App Store |
| `eas submit --platform android` | Загрузить на Google Play |
| `eas build --platform ios --auto-submit` | Собрать + загрузить iOS за один шаг |
| `eas build --platform android --auto-submit` | Собрать + загрузить Android за один шаг |

---

## Полезные ссылки

- **Expo Dashboard (статус билда):** https://expo.dev/projects
- **EAS Build документация:** https://docs.expo.dev/build/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **Google Play Console:** https://play.google.com/console/
- **Apple Developer Program:** https://developer.apple.com/programs/
- **Expo документация:** https://docs.expo.dev/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/

---

Всё! Код уже готов. Скриншоты сделайте в симуляторе, заполните данные в магазинах, и через 24–48 часов ваше приложение будет доступно пользователям! 🎉
