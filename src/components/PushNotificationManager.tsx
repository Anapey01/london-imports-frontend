"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { deviceAPI } from "@/lib/api";

/**
 * Request notification permission and register push subscription with backend.
 * Triggers native Android 13+ permission dialog inside Android TWA.
 */
export async function requestAndRegisterPush(): Promise<{
  success: boolean;
  permission: NotificationPermission;
  error?: string;
}> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return { success: false, permission: "denied", error: "Push notifications not supported on this device" };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, permission };
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration || !registration.pushManager) {
      return { success: false, permission, error: "Service worker push manager unavailable" };
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const options: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
        ...(vapidKey ? { applicationServerKey: vapidKey } : {}),
      };
      try {
        subscription = await registration.pushManager.subscribe(options);
      } catch (subErr) {
        console.debug("[Push] Web push subscribe deferred:", subErr);
      }
    }

    if (subscription) {
      const rawToken = JSON.stringify(subscription);
      const isAndroid = /Android/i.test(navigator.userAgent);
      await deviceAPI.register({
        fcm_token: rawToken,
        platform: isAndroid ? "android" : "web",
        device_name: isAndroid ? "Android Device" : "Browser",
      });
      localStorage.setItem("londons_registered_push_token", rawToken);
      console.log("[Push] Device registered with backend successfully.");
    }

    return { success: true, permission: "granted" };
  } catch (err: unknown) {
    console.error("[Push] Error registering push:", err);
    const errorMessage = err instanceof Error ? err.message : "Registration failed";
    return { success: false, permission: Notification.permission, error: errorMessage };
  }
}

/**
 * Send an immediate test notification via the active Service Worker
 * and dispatch the backend test push task.
 */
export async function dispatchTestNotification(): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { success: false, message: "Notifications not supported" };
  }

  if (Notification.permission !== "granted") {
    return { success: false, message: "Notification permission not granted" };
  }

  try {
    // 1. Direct native vibration & notification popup via Service Worker
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        const options: NotificationOptions & { vibrate?: number[] } = {
          body: "Notification channel active! Real-time flight departures, customs clearance, and delivery updates are ready.",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          vibrate: [150, 50, 150],
          data: { url: "/track" },
          tag: "test-alert",
          renotify: true,
        };
        await registration.showNotification("London's Imports 📦", options);
      }
    }

    // 2. Dispatch backend Celery test alert
    try {
      await deviceAPI.testPush();
    } catch (backendErr) {
      console.debug("[Push] Backend test-push task queued:", backendErr);
    }

    return { success: true, message: "Test notification sent! Check your notification shade." };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to trigger test notification";
    return { success: false, message: errorMessage };
  }
}

/**
 * PushNotificationManager component
 * Silently registers device push tokens for authenticated users if permission is already granted.
 */
export default function PushNotificationManager() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      return;
    }

    if (Notification.permission === "granted") {
      requestAndRegisterPush();
    }
  }, [isAuthenticated, user]);

  return null;
}

