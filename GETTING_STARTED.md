# Getting Started with tf-checkout-react-native

This guide walks you through setting up the library and running your first checkout flow, from fetching your events to completing a test purchase.

---

## Step 1 — Fetch your events dynamically

Your event catalogue is not static. Events are created and ended continuously, so your app must call the Events API at runtime — typically when the user opens the event selection screen — and build its UI from the live response. Never hardcode an event ID.

The `id` returned for each event is the value you will pass as `EVENT_ID` to `setConfig` once the user (or your routing logic) selects an event.

### 1.1 Generate an API key

1. Log in to the [Ticket Fairy dashboard](https://www.ticketfairy.com) with an admin or owner account.
2. Open **Account Settings → API Key**.
3. Click **Generate API Key** (or copy the existing one). Treat it like a password — never commit it to source control or embed it in a mobile binary.

> This key is for **server-side use only**. Do not ship it inside your React Native app — proxy the request through your own backend and return only the event data your app needs.

### 1.2 Call the events endpoint at runtime

From your server, fetch the current list whenever your app needs it:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  "https://www.ticketfairy.com/api/events?section_type=next_events&page=1&limit=20"
```

To narrow results to a specific brand, add `brands=<brandId>`:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  "https://www.ticketfairy.com/api/events?brands=6282&section_type=next_events&page=1&limit=20"
```

Server-side JavaScript example (call this from your API layer, not from the app):

```js
async function fetchUpcomingEvents(brandId) {
  const params = new URLSearchParams({
    brands: brandId,
    section_type: 'next_events',
    order: 'ASC',
  })
  const response = await fetch(`https://www.ticketfairy.com/api/events?${params}`, {
    headers: { Authorization: 'Bearer YOUR_API_KEY_HERE' },
  })
  const { data } = await response.json()
  // Return the list to your app — each item's `id` is the EVENT_ID
  return data.map(event => ({
    id: event.id,
    name: event.attributes.displayName,
    startDate: event.attributes.startDate,
    url: event.attributes.url,
  }))
}
```

**Response shape:**

```json
{
  "data": [
    {
      "id": "19939",
      "type": "event",
      "attributes": {
        "displayName": "Summer Festival",
        "startDate": "2025-06-15T22:00:00.000Z",
        "endDate": "2025-06-16T05:00:00.000Z",
        "status": "published",
        "url": "https://www.ticketfairy.com/event/summer-festival"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 134 }
}
```

Your app receives this list, renders an event picker, and when the user selects one, passes its `id` to `setConfig` as `EVENT_ID` (see Step 4).

**Available query parameters**

| Parameter | Description |
|-----------|-------------|
| `brands` | Comma-separated brand IDs — limit to specific brands |
| `search_query` | Free-text search across name, brand, venue, city |
| `section_type` | `next_events` for upcoming only; omit for all |
| `order` | `ASC` or `DESC` by start date (default `DESC`) |
| `page` / `limit` | Pagination — always paginate for large brands |
| `compact` | `true` returns a slimmer payload |

**Common errors**

| Status | Meaning |
|--------|---------|
| 401 | Missing or incorrect API key |
| 403 | Key is valid but user has no brand access |
| 5xx | Server error — retry with backoff |

---

## Step 2 — Install the library

```bash
# pnpm
pnpm add tf-checkout-react-native \
  @react-native-async-storage/async-storage@^2.0.0 \
  @react-native-clipboard/clipboard@^1.14.0 \
  @react-native-community/datetimepicker@^8.0.0 \
  react-native-background-timer@^2.4.1 \
  react-native-device-country@^1.1.1 \
  react-native-fs@^2.18.0 \
  @stripe/stripe-react-native@^0.54.0

# yarn
yarn add tf-checkout-react-native \
  @react-native-async-storage/async-storage@^2.0.0 \
  @react-native-clipboard/clipboard@^1.14.0 \
  @react-native-community/datetimepicker@^8.0.0 \
  react-native-background-timer@^2.4.1 \
  react-native-device-country@^1.1.1 \
  react-native-fs@^2.18.0 \
  @stripe/stripe-react-native@^0.54.0
```

> **Expo users** — only these three native modules are required:
> `@react-native-async-storage/async-storage`, `@react-native-clipboard/clipboard`, `react-native-background-timer`.

---

## Step 3 — Platform setup

### iOS

```bash
cd ios && pod install
```

In `Info.plist`, add these keys if you want PDF downloads to work:

```xml
<key>UIFileSharingEnabled</key><true/>
<key>LSSupportsOpeningDocumentsInPlace</key><true/>
```

Minimum deployment target: **iOS 13.0**.

### Android

In `app/build.gradle`:

```java
implementation 'com.google.android.material:material:1.4.0'
```

In `res/values/styles.xml`:

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.DayNight.NoActionBar">
  <!-- your theme attributes -->
</style>
```

For PDF downloads, add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

Minimum SDK: **API 21 (Android 5.0)**.

### Metro

Add to `metro.config.js` inside `resolver`:

```js
sourceExts: ['jsx', 'js', 'ts', 'tsx']
```

---

## Step 4 — Configure the library

Call `setConfig` once at app startup, before rendering any library component. It is async — wait for it to finish before showing ticketing UI. If you don't use SSO you don't need to pass the AUTH config, we don't support SSO for all brands, if you think you might require contact support

Note that if you only have access to https://manage.ticketfairy.com you only will use "ENV: PROD" in the config, if you think you might require access to staging contact support.

```tsx
import React, { useEffect, useState } from 'react'
import { setConfig } from 'tf-checkout-react-native'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConfig({
      EVENT_ID: '19939',         // from Step 1
      CLIENT: 'your-client',    // your brand's short name
      ENV: 'PROD',              // 'PROD' | 'STAG' | 'DEV'
      CLIENT_ID: 'YOUR_CLIENT_ID',
      CLIENT_SECRET: 'YOUR_CLIENT_SECRET',
    }).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return <YourCheckoutFlow />
}
```

**`setConfig` options**

| Option | Required | Description |
|--------|----------|-------------|
| `EVENT_ID` | Yes | Event ID from Step 1 |
| `CLIENT` | Recommended | Your brand's short name, e.g. `ttf` |
| `ENV` | No | `PROD` (default), `STAG`, or `DEV` |
| `CLIENT_ID` | Yes | OAuth client ID |
| `CLIENT_SECRET` | Yes | OAuth client secret |
| `BRAND` | No | Limits My Orders to this brand's tickets |
| `ARE_SUB_BRANDS_INCLUDED` | No | Include sub-brand orders in My Orders |
| `TIMEOUT` | No | Custom API request timeout in ms |
| `AUTH` | No | SSO — pass pre-existing access/refresh tokens |

---

## Step 5 — Build a checkout flow

### Option A — Modern hooks API (recommended)

Use `useCheckoutFlow` + `CheckoutProvider`. This is the recommended approach as of v1.0.38.

```tsx
import React from 'react'
import { ActivityIndicator } from 'react-native'
import {
  CheckoutProvider,
  useCheckoutFlow,
  CheckoutForm,
} from 'tf-checkout-react-native'

function CheckoutScreen({ navigation }) {
  const {
    onSubmit,
    initialValues,
    countries,
    states,
    orderItems,
    secondsLeft,
    isSubmitting,
    isInitialLoading,
  } = useCheckoutFlow({
    onCartExpired: () => navigation.navigate('Tickets'),
    onCheckoutSuccess: ({ hash, total }) => {
      navigation.navigate('Payment', { hash, total })
    },
    onPaymentSuccess: () => navigation.navigate('Confirmation'),
  })

  if (isInitialLoading) return <ActivityIndicator />

  return (
    <CheckoutForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      countries={countries}
      states={states}
      orderItems={orderItems}
      secondsLeft={secondsLeft}
      isSubmitting={isSubmitting}
    />
  )
}

export default function CheckoutPage({ navigation }) {
  return (
    <CheckoutProvider>
      <CheckoutScreen navigation={navigation} />
    </CheckoutProvider>
  )
}
```

### Option B — Pre-built UI components

If you want ready-made screens with minimal configuration, use the UI container components. Wire them together through their callbacks.

```tsx
import React, { useState } from 'react'
import { Tickets, BillingInfo, Checkout, PurchaseConfirmation } from 'tf-checkout-react-native'

type Screen = 'tickets' | 'billing' | 'checkout' | 'confirmation'

export default function TicketFlow() {
  const [screen, setScreen] = useState<Screen>('tickets')
  const [cartProps, setCartProps] = useState(null)
  const [checkoutProps, setCheckoutProps] = useState(null)

  if (screen === 'tickets') {
    return (
      <Tickets
        onAddToCartSuccess={(data) => {
          setCartProps(data)
          setScreen('billing')
        }}
        onPressMyOrders={() => {/* navigate to orders */}}
        config={{ areActivityIndicatorsEnabled: true, areAlertsEnabled: true }}
      />
    )
  }

  if (screen === 'billing') {
    return (
      <BillingInfo
        cartProps={cartProps}
        onCheckoutSuccess={(data) => {
          setCheckoutProps(data)
          setScreen('checkout')
        }}
        onLoginSuccess={() => {}}
      />
    )
  }

  if (screen === 'checkout') {
    return (
      <Checkout
        hash={checkoutProps.hash}
        total={checkoutProps.total}
        onPaymentSuccess={() => setScreen('confirmation')}
        onPressExit={() => setScreen('tickets')}
      />
    )
  }

  return (
    <PurchaseConfirmation
      orderHash={checkoutProps.hash}
      onComplete={() => setScreen('tickets')}
    />
  )
}
```

---

## Step 6 — Test the integration

### Checklist

- [ ] `setConfig` resolves without error and `ready` becomes `true`
- [ ] The `Tickets` screen loads and displays ticket types for your event
- [ ] Adding tickets to cart calls `onAddToCartSuccess`
- [ ] The `BillingInfo` form submits and calls `onCheckoutSuccess` with a `hash`
- [ ] The `Checkout` screen initialises Stripe and the pay button appears
- [ ] A test payment (use [Stripe test cards](https://stripe.com/docs/testing#cards)) completes and calls `onPaymentSuccess`
- [ ] `PurchaseConfirmation` renders for the returned `hash`
- [ ] My Orders shows the test purchase

### Useful Stripe test cards

| Scenario | Card number |
|----------|-------------|
| Success | `4242 4242 4242 4242` |
| Authentication required | `4000 0025 0000 3155` |
| Decline | `4000 0000 0000 9995` |

Use any future expiry, any 3-digit CVC, and any 5-digit ZIP.

### Staging vs production

Set `ENV: 'STAG'` while testing — this routes requests to the staging API so test payments do not create real orders. Switch to `ENV: 'PROD'` only when going live.

---

## Token refresh (SSO)

If you manage authentication externally and pass tokens via `AUTH` in `setConfig`, refresh them before they expire:

```ts
import { refreshAccessToken } from 'tf-checkout-react-native'

const result = await refreshAccessToken() // uses stored refresh token
if (result.accessTokenData) {
  // store the new tokens if needed
}
if (result.accessTokenError) {
  // prompt user to log in again
}
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Tickets screen is blank | `setConfig` not awaited | Ensure `ready` gate is in place |
| 401 from the library API | Wrong `CLIENT_ID` / `CLIENT_SECRET` | Verify credentials against your dashboard |
| Stripe card form does not appear | Missing `@stripe/stripe-react-native` setup | Follow [Stripe RN docs](https://github.com/stripe/stripe-react-native) |
| Metro bundler error about JSX | Missing `sourceExts` in metro config | Add `sourceExts: ['jsx', 'js', 'ts', 'tsx']` |
| PDF download fails on Android | Missing storage permission | Add `WRITE_EXTERNAL_STORAGE` to manifest |
| Pods build error on iOS | Stripe pods not installed | Run `pod install` in `ios/` |
