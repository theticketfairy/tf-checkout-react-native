# tf-checkout-react-native

Ticket Fairy's React Native checkout SDK has two source lines.

The **2.x implementation** is maintained in
[`tf-shared-libraries/packages/tf-checkout-react-native`](https://github.com/theticketfairy/tf-shared-libraries/tree/codex/consumer-app-completion/packages/tf-checkout-react-native).
It bundles the private `tf-checkout-shared` core used by both platform SDKs.
Portable checkout behavior belongs in that core; platform packages own their
rendering, payment bindings and storage adapters. Read the monorepo's
[setup](https://github.com/theticketfairy/tf-shared-libraries/tree/codex/consumer-app-completion/packages/tf-checkout-react-native#readme),
[integration progress](https://github.com/theticketfairy/tf-shared-libraries/blob/codex/consumer-app-completion/docs/integration/consumer-app-sdk.md)
and [release procedure](https://github.com/theticketfairy/tf-shared-libraries/blob/codex/consumer-app-completion/docs/RELEASING.md).

The consumer 2.0 work is still in progress. Its development tarballs do not mean
a stable package has been published. Check the registry before choosing a version:

```sh
npm view tf-checkout-react-native dist-tags --json
npm view tf-checkout-react-native version
```

The **1.x implementation** remains in this repository. Its existing entry points
and build system are documented in [the 1.x guide](docs/SDK_V1.md). A fix made
here must also be checked against the shared core when it affects behavior used
by the consumer site, embedded checkout or consumer app.

Both 2.x SDKs must publish matching verified versions. Never publish this legacy
source under a 2.x version or copy an older standalone build into the consumer
app to bypass a missing shared implementation. Consumer subscriptions stay hidden
for the initial 2.0 app release; refund protection is explicitly deferred.
