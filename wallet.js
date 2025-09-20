// wallets.js
// Detection + connect flow with platform biometric/passkey prompt (WebAuthn create() fallback)

// CONFIG: map wallet keys to deep links, android intents, install pages and provider-checkers
const WALLET_CONFIG = {
  metamask: {
    label: "MetaMask",
    deepLink: "metamask://",
    androidIntent: "intent://open/#Intent;package=io.metamask;scheme=metamask;end",
    installUrl: "https://metamask.io/download/",
    providerCheck: async () => {
      try {
        if (window.ethereum && (window.ethereum.isMetaMask || window.ethereum.providerName === "MetaMask")) {
          return { ok: true, kind: "ethereum", provider: window.ethereum };
        }
      } catch (e) {}
      return { ok: false };
    }
  },

  phantom: {
    label: "Phantom Wallet",
    deepLink: "phantom://",
    installUrl: "https://phantom.app/download",
    providerCheck: async () => {
      try {
        if (window.solana && window.solana.isPhantom) return { ok: true, kind: "solana", provider: window.solana };
      } catch (e) {}
      return { ok: false };
    }
  },

  trustwallet: {
    label: "Trust Wallet",
    deepLink: "trust://browser_enable?url=" + encodeURIComponent(location.href),
    androidIntent: "intent://browser_enable?url=" + encodeURIComponent(location.href) + "#Intent;package=com.wallet.crypto.trustapp;scheme=trust;end",
    installUrl: "https://trustwallet.com/",
    providerCheck: async () => {
      try {
        if (window.ethereum && window.ethereum.isTrust) return { ok: true, kind: "ethereum", provider: window.ethereum };
      } catch (e) {}
      return { ok: false };
    }
  },

  coinbase: {
    label: "Coinbase Wallet",
    deepLink: "coinbase://",
    androidIntent: "intent://#Intent;package=com.coinbase.android;scheme=coinbase;end",
    installUrl: "https://www.coinbase.com/mobile",
    providerCheck: async () => {
      try {
        if (window.ethereum && window.ethereum.isCoinbaseWallet) return { ok: true, kind: "ethereum", provider: window.ethereum };
      } catch (e) {}
      return { ok: false };
    }
  },

  // MORE (trimmed) - add configs for the selected wallets
  binance: { label: "Binance Web3 Wallet", deepLink: "binancewallet://", installUrl: "https://www.binance.com/en/download", providerCheck: async()=>{ if(window.BinanceChain) return {ok:true, kind:'ethereum', provider: window.BinanceChain}; return {ok:false}; } },
  okx: { label: "OKX Wallet", deepLink: "okx://wallet", installUrl: "https://www.okx.com/download", providerCheck: async()=>({ok:false}) },
  bybit: { label: "Bybit Wallet", deepLink: "bybit://", installUrl: "https://www.bybit.com/app", providerCheck: async()=>({ok:false}) },
  kraken: { label: "Kraken Wallet", deepLink: "kraken://", installUrl: "https://www.kraken.com", providerCheck: async()=>({ok:false}) },
  bitget: { label: "Bitget Wallet", deepLink: "bitget://", installUrl: "https://www.bitget.com", providerCheck: async()=>({ok:false}) },
  safepal: { label: "SafePal", deepLink: "safepal://", installUrl: "https://safepal.com/", providerCheck: async()=>({ok:false}) },
  blockchaincom: { label: "Blockchain.com Wallet", deepLink: "blockchain://", installUrl: "https://www.blockchain.com/", providerCheck: async()=>({ok:false}) },
  atomic: { label: "Atomic Wallet", deepLink: "atomic://", installUrl: "https://atomicwallet.io/", providerCheck: async()=>({ok:false}) },
  myetherwallet: { label: "MyEtherWallet (MEW mobile)", deepLink: "mew://", installUrl: "https://www.myetherwallet.com/", providerCheck: async()=>({ok:false}) },
  solflare: { label: "Solflare", deepLink: "solflare://", installUrl: "https://solflare.com/", providerCheck: async()=>{ if(window.solflare) return {ok:true, kind:'solana', provider:window.solflare}; return {ok:false}; } },
  tonkeeper: { label: "Tonkeeper", deepLink: "tonkeeper://", installUrl: "https://tonkeeper.com/", providerCheck: async()=>({ok:false}) },
  zengo: { label: "Zengo", deepLink: "zengo://", installUrl: "https://zengo.com/", providerCheck: async()=>({ok:false}) },
  wirex: { label: "Wirex Wallet", deepLink: "wirex://", installUrl: "https://wirexapp.com/", providerCheck: async()=>({ok:false}) },
  bitpay: { label: "BitPay Wallet", deepLink: "bitpay://", installUrl: "https://bitpay.com/wallet/", providerCheck: async()=>({ok:false}) },
  guarda: { label: "Guarda Wallet", deepLink: "guarda://", installUrl: "https://guarda.co/", providerCheck: async()=>({ok:false}) },
  coinomi: { label: "Coinomi", deepLink: "coinomi://", installUrl: "https://www.coinomi.com/", providerCheck: async()=>({ok:false}) },
  enjin: { label: "Enjin Wallet", deepLink: "enjin://", installUrl: "https://enjin.io/products/wallet", providerCheck: async()=>({ok:false}) },
  tokenpocket: { label: "TokenPocket", deepLink: "tpoutside://", installUrl: "https://www.tokenpocket.pro/", providerCheck: async()=>({ok:false}) },
  imtoken: { label: "imToken", deepLink: "imtokenv2://", installUrl: "https://token.im/", providerCheck: async()=>({ok:false}) },
  keplr: { label: "Keplr", deepLink: "keplrwallet://", installUrl: "https://www.keplr.app/", providerCheck: async()=>{ if(window.keplr) return {ok:true, kind:'cosmos', provider:window.keplr}; return {ok:false} } },
  klever: { label: "Klever Wallet", deepLink: "kleverwallet://", installUrl: "https://klever.io/", providerCheck: async()=>({ok:false}) },
  edge: { label: "Edge Wallet", deepLink: "edge://", installUrl: "https://edge.app/", providerCheck: async()=>({ok:false}) },
  tangem: { label: "Tangem", deepLink: "tangem://", installUrl: "https://tangem.com/", providerCheck: async()=>({ok:false}) },
  coolwallet: { label: "CoolWallet", deepLink: "coolwallet://", installUrl: "https://www.coolwallet.io/", providerCheck: async()=>({ok:false}) },
  ellipal: { label: "Ellipal", deepLink: "ellipal://", installUrl: "https://www.ellipal.com/", providerCheck: async()=>({ok:false}) },
  now: { label: "NOW Wallet", deepLink: "nowwallet://", installUrl: "https://nowwallet.app/", providerCheck: async()=>({ok:false}) },
  pera: { label: "Pera Algo Wallet", deepLink: "pera://", installUrl: "https://pera.org/", providerCheck: async()=>({ok:false}) },
  near: { label: "NEAR Wallet", deepLink: "nearwallet://", installUrl: "https://wallet.near.org/", providerCheck: async()=>({ok:false}) },
  pontem: { label: "Pontem Aptos Wallet", deepLink: "pontem://", installUrl: "https://pontem.network/", providerCheck: async()=>({ok:false}) },
  rainbow: { label: "Rainbow Wallet", deepLink: "rainbow://", installUrl: "https://rainbow.me/", providerCheck: async()=>({ok:false}) },
  unstoppable: { label: "Unstoppable Wallet", deepLink: "unstoppable://", installUrl: "https://unstoppabledomains.com/", providerCheck: async()=>({ok:false}) },
  mathwallet: { label: "MathWallet", deepLink: "mathwallet://", installUrl: "https://mathwallet.org/", providerCheck: async()=>({ok:false}) },
  best: { label: "Best Wallet", deepLink: "bestwallet://", installUrl: "https://bestwallet.io/", providerCheck: async()=>({ok:false}) }
};

// Attempt to open native app via deeplink/intent and infer success via visibility change
function tryOpenApp({ deepLink, androidIntent, timeoutMs = 1400 }) {
  return new Promise((resolve) => {
    let done = false;
    const start = Date.now();

    function cleanup() {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onSuccess);
      window.removeEventListener('blur', onBlur);
    }
    function onSuccess() { if (!done) { done = true; cleanup(); resolve(true); } }
    function onFail() { if (!done) { done = true; cleanup(); resolve(false); } }

    function onVis() { if (document.hidden) onSuccess(); }
    function onBlur() { setTimeout(() => { if (!done) onSuccess(); }, 300); }

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onSuccess);
    window.addEventListener('blur', onBlur);

    try {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid && androidIntent) location.href = androidIntent;
      else if (deepLink) location.href = deepLink;
      else onFail();
    } catch (e) {
      console.warn('deep link call failed', e);
    }

    setTimeout(() => {
      if (!done) {
        if (document.hidden) onSuccess(); else onFail();
      }
    }, timeoutMs);
  });
}

// Request local device verification (biometric/passkey) via WebAuthn (platform authenticator) if available.
// This uses navigator.credentials.create() as a way to invoke platform auth. It's "best-effort" client-side.
// If not available, falls back to confirm() prompt.
async function requestDeviceAuth(label = "Confirm to connect") {
  // If WebAuthn supported, attempt create() with platform authenticator to prompt biometric
  if (window.PublicKeyCredential && navigator.credentials && navigator.credentials.create) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      // random user id (temporary). In production, user id + challenge should come from server.
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const publicKey = {
        challenge,
        rp: { name: location.hostname || "dapp" },
        user: {
          id: userId,
          name: "temp-user",
          displayName: "User"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
        timeout: 60000,
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        attestation: "direct"
      };

      // This will prompt the platform authenticator (biometric/pin).
      const cred = await navigator.credentials.create({ publicKey });
      // We don't verify on server here — presence of response indicates successful auth.
      if (cred) return { ok: true };
    } catch (e) {
      // WebAuthn may throw if not available or user cancels. Fall back to confirm below.
      console.warn('webauthn create failed', e);
    }
  }

  // Fallback: simple confirm prompt
  const ok = confirm(label + "\n\nPress OK to authorize.");
  return { ok };
}

// High-level handler invoked when user clicks wallet
async function handleWalletSelect(key) {
  const cfg = WALLET_CONFIG[key];
  if (!cfg) {
    alert("Unsupported wallet: " + key);
    return;
  }

  // 1) Try provider / injected detection
  let providerResult = { ok: false };
  try {
    if (typeof cfg.providerCheck === 'function') {
      providerResult = await cfg.providerCheck();
    }
  } catch (e) {
    console.warn('provider check error', e);
    providerResult = { ok: false };
  }

  // 2) Ask user for device auth (biometric/passkey) BEFORE proceeding
  const auth = await requestDeviceAuth("Authorize connection to " + (cfg.label || key));
  if (!auth.ok) {
    alert("Authorization cancelled.");
    return;
  }

  // 3A) If provider present -> call wallet connect methods
  if (providerResult && providerResult.ok) {
    try {
      if (providerResult.kind === "ethereum" && providerResult.provider && providerResult.provider.request) {
        // EVM wallet
        const accounts = await providerResult.provider.request({ method: "eth_requestAccounts" });
        alert((cfg.label || key) + " connected: " + (accounts && accounts[0] ? accounts[0] : "connected"));
        return;
      } else if (providerResult.kind === "solana" && providerResult.provider && providerResult.provider.connect) {
        const res = await providerResult.provider.connect();
        alert((cfg.label || key) + " connected: " + (res && res.publicKey ? res.publicKey.toString() : "connected"));
        return;
      } else if (providerResult.provider && providerResult.provider.connect) {
        // generic connect attempt
        try { await providerResult.provider.connect(); alert((cfg.label || key) + " connected"); return; } catch(e){}
      }
    } catch (e) {
      console.warn('provider connect error', e);
      // continue to deep-link fallback
    }
  }

  // 3B) No injected provider or connect failed -> attempt to open native app via deep link / intent
  const wantsToOpen = confirm((cfg.label || key) + " not found in browser. Attempt to open the app on your device?");
  if (!wantsToOpen) return;

  const opened = await tryOpenApp({ deepLink: cfg.deepLink, androidIntent: cfg.androidIntent, timeoutMs: 1600 });
  if (opened) {
    alert((cfg.label || key) + " app opened. Complete the connection inside the wallet.");
    return;
  }

  // 3C) If not opened -> prompt install
  if (cfg.installUrl) {
    const go = confirm((cfg.label || key) + " not found. Would you like to open the install page?");
    if (go) window.open(cfg.installUrl, "_blank");
    else alert("Wallet not found");
  } else {
    alert("Wallet not found");
  }
}

// Attach click handlers (buttons in HTML must have data-wallet attributes matching keys)
function attachWalletButtons() {
  document.querySelectorAll('.wallet-btn[data-wallet]').forEach(btn => {
    // normalize key to match config keys
    const raw = btn.getAttribute('data-wallet');
    // allow keys with spaces/lowercase: transform to config key style used above
    const key = raw ? raw.trim().toLowerCase().replace(/\s+/g, '').replace(/\./g,'').replace(/\(|\)/g,'') : '';
    // Some mapping exceptions (if your HTML uses different data-wallet values, adjust map here)
    const mapping = {
      'trustwallet': 'trustwallet',
      'metamask': 'metamask',
      'phantom': 'phantom',
      'coinbase': 'coinbase',
      'binance': 'binance',
      'okx': 'okx',
      'bybit': 'bybit',
      'kraken': 'kraken',
      'bitget': 'bitget',
      'safepal': 'safepal',
      'blockchaincom': 'blockchaincom',
      'atomic': 'atomic',
      'myetherwallet': 'myetherwallet',
      'solflare': 'solflare',
      'tonkeeper': 'tonkeeper',
      'zengo': 'zengo',
      'wirex': 'wirex',
      'bitpay': 'bitpay',
      'guarda': 'guarda',
      'coinomi': 'coinomi',
      'enjin': 'enjin',
      'tokenpocket': 'tokenpocket',
      'imtoken': 'imtoken',
      'keplr': 'keplr',
      'klever': 'klever',
      'edge': 'edge',
      'tangem': 'tangem',
      'coolwallet': 'coolwallet',
      'ellipal': 'ellipal',
      'now': 'now',
      'pera': 'pera',
      'near': 'near',
      'pontem': 'pontem',
      'rainbow': 'rainbow',
      'unstoppable': 'unstoppable',
      'mathwallet': 'mathwallet',
      'best': 'best'
    };
    const cfgKey = mapping[key] || key;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleWalletSelect(cfgKey);
    });
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachWalletButtons);
} else {
  attachWalletButtons();
}
