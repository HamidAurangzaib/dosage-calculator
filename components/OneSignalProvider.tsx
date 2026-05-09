'use client';

import Script from 'next/script';

const ONESIGNAL_APP_ID = '6a2e9401-d0a5-48e1-bd4d-15b1609367c5';
const SAFARI_WEB_ID = 'web.onesignal.auto.283a79e5-74a1-4b9f-8067-e75dbf426ba4';

export default function OneSignalProvider() {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "${ONESIGNAL_APP_ID}",
              safari_web_id: "${SAFARI_WEB_ID}",
              serviceWorkerPath: "/OneSignalSDKWorker.js",
              notifyButton: { enable: false },
              autoRegister: false,
              autoResubscribe: true,
              promptOptions: {
                slidedown: { prompts: [] }
              }
            });
          });
        `}
      </Script>
    </>
  );
}
