# MarrengulaIT Mobile App - Capacitor Setup

## Visão Geral

O MarrengulaIT agora tem um projeto Android (e futuramente iOS) gerado com Capacitor.js. Isso permite criar apps mobile nativos a partir do mesmo código web.

## Estrutura do Projeto

```
marrengulait/
├── android/          # Projeto Android nativo
├── capacitor.config.ts  # Configuração do Capacitor
└── src/             # Código web (React)
```

## Comandos Úteis

### Desenvolvimento
```bash
# Build da app web
npm run build

# Sincronizar com Android
npx cap sync android

# Abrir Android Studio
npx cap open android
```

### Build do APK
```bash
# Entrar na pasta android
cd android

# Build do APK (Debug)
./gradlew assembleDebug

# Ou usar o Android Studio:
# File > Open > selecionar pasta "android"
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### Localização do APK
O APK gerado estará em:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Instalar no Telemóvel

1. Copiar o APK para o telemóvel
2. Ativar "Fontes Desconhecidas" nas definições
3. Abrir o APK e instalar

## Adicionar Plugins Capacitor (Opcional)

Para funcionalidades extras:

```bash
# Notificações push
npm install @capacitor/push-notifications

# Estado da rede
npm install @capacitor/network

# Câmaras
npm install @capacitor/camera

# Storage local
npm install @capacitor/storage

# Depois de instalar:
npx cap sync android
```

## Próximos Passos

1. **Personalizar ícones**: Substituir ícones em `android/app/src/main/res/`
2. **Configurar splash screen**: Modificar `splash.png` nas pastas drawable
3. **Assinatura do APK**: Para distribuição, gerar APK release com keystore
4. **Publicar**: Play Store (Android) / App Store (iOS)

## Notas

- O app usa o mesmo código web, então todas as alterações em `src/` precisam de rebuild
- Para iOS, precisas de Mac com Xcode: `npx cap add ios`
