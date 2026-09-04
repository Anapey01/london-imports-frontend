"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { deviceAPI } from "@/lib/api";

/**
 * PushNotificationManager
 * Automatically registers device push tokens for authenticated users in the Android TWA and PWA.
 */
export default function PushNotificationManager() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      return;
    }

    const registerPush = async () => {
      try {
        if (Notification.permission !== "granted") {
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        if (!registration || !registration.pushManager) return;

        let subscription = await registration.pushManager.getSubscription();

        // If no existing subscription, register with standard push manager
        if (!subscription) {
          // Check if VAPID public key is configured in env, or subscribe
          const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
          const options: PushSubscriptionOptionsInit = {
            userVisibleOnly: true,
            ...(vapidKey ? { applicationServerKey: vapidKey } : {}),
          };
          try {
            subscription = await registration.pushManager.subscribe(options);
          } catch (subErr) {
            // In case subscription fails (e.g. no vapid key provided yet)
            console.debug("[Push] Web push subscribe deferred:", subErr);
            return;
          }
        }

        if (subscription) {
          const rawToken = JSON.stringify(subscription);
          const cachedToken = localStorage.getItem("londons_registered_push_token");

          if (cachedToken !== rawToken) {
            const isAndroid = /Android/i.test(navigator.userAgent);
            await deviceAPI.register({
              fcm_token: rawToken,
              platform: isAndroid ? "android" : "web",
              device_name: isAndroid ? "Android Device" : "Browser",
            });
            localStorage.setItem("londons_registered_push_token", rawToken);
            console.log("[Push] Device successfully registered for notifications.");
          }
        }
      } catch (err) {
        console.debug("[Push] Push registration check completed:", err);
      }
    };

    registerPush();
  }, [isAuthenticated, user]);

  return null;
}
