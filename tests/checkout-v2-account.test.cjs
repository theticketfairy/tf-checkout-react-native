const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const React = require('react');
const ts = require('typescript');

// Execute the complete component with controlled hook/native boundaries. This
// tests returned React props, not mounted effects or native SDK initialization.
function controller() {
  let flow;
  const StripeProvider = () => null;
  const CheckoutForm = () => null;
  const Login = () => null;
  const modules = {
    'react': {
      ...React,
      useCallback: (callback) => callback,
      useMemo: (factory) => factory(),
      useRef: (current) => ({ current }),
      useState: (initial) => [initial, () => {}],
    },
    '@tanstack/react-query': {
      QueryClient: class {},
      QueryClientProvider: () => null,
    },
    'react-native': {
      StyleSheet: { create: (styles) => styles, flatten: (styles) => styles },
    },
    'react-native-keyboard-aware-scroll-view': {
      KeyboardAwareScrollView: () => null,
    },
    '../../components': { CartTimer: () => null, FormField: () => null, Login },
    '../../utils/Logger': { logger: {} },
    '../auth/api-hooks': {
      useUserProfile: () => ({ data: undefined, invalidate: () => {} }),
    },
    './form': { CheckoutForm, PaymentForm: () => null },
    './hooks/use-checkout': { useCheckoutFlow: () => flow },
    '@stripe/stripe-react-native': { StripeProvider },
  };
  const source = fs.readFileSync(
    process.env.CHECKOUT_ACCOUNT_TEST_SOURCE ||
      path.join(__dirname, '../src/features/checkout-v2/index.tsx'),
    'utf8'
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });
  assert.deepEqual(compiled.diagnostics, []);
  const exports = {};
  vm.runInNewContext(compiled.outputText, {
    exports,
    require: (name) => {
      assert.ok(Object.hasOwn(modules, name), `Unexpected dependency: ${name}`);
      return modules[name];
    },
  });
  return {
    StripeProvider,
    CheckoutForm,
    Login,
    render: (basicConfig) => {
      flow = {
        checkoutData:
          basicConfig === undefined
            ? undefined
            : {
                attributes: {
                  additional_payment_information: { basic_config: basicConfig },
                },
              },
      };
      return exports.CheckoutController({});
    },
  };
}

function elements(node, type) {
  if (Array.isArray(node))
    return node.flatMap((child) => elements(child, type));
  if (!React.isValidElement(node)) return [];
  return [
    ...(node.type === type ? [node] : []),
    ...elements(node.props.children, type),
  ];
}

test('the actual provider receives each connected account with its publishable key', () => {
  const view = controller();
  for (const [apiKey, accountId] of [
    ['pk_test_synthetic', 'acct_synthetic_A'],
    ['pk_test_synthetic', 'acct_synthetic_B'],
    ['pk_test_other', 'acct_synthetic_C'],
  ]) {
    const tree = view.render({ apiKey, accountId });
    const providers = elements(tree, view.StripeProvider);
    assert.equal(providers.length, 1);
    assert.equal(providers[0].props.publishableKey, apiKey);
    assert.equal(providers[0].props.stripeAccountId, accountId);
    // No account-derived React key is introduced to force a remount.
    assert.equal(providers[0].key, null);
    assert.equal(elements(providers[0], view.CheckoutForm).length, 1);
  }
});

test('null and absent accounts preserve the platform-account default', () => {
  const view = controller();
  for (const config of [
    { apiKey: 'pk_test_synthetic', accountId: null },
    { apiKey: 'pk_test_synthetic' },
  ]) {
    const provider = elements(view.render(config), view.StripeProvider)[0];
    assert.equal(provider.props.publishableKey, config.apiKey);
    assert.equal(provider.props.stripeAccountId, undefined);
  }
});

test('missing or empty publishable keys keep the existing conditional render', () => {
  const view = controller();
  for (const config of [undefined, {}, { apiKey: '' }, { apiKey: null }]) {
    const tree = view.render(config);
    assert.equal(elements(tree, view.StripeProvider).length, 0);
    assert.equal(elements(tree, view.CheckoutForm).length, 0);
    assert.equal(elements(tree, view.Login).length, 1);
  }
});
