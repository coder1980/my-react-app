// Device fingerprinting utilities
// Generates a deterministic identifier for a physical device without relying on localStorage

const encodeForHash = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && !Number.isFinite(value)) return '';
  return String(value).toLowerCase();
};

const normalizeNumber = (value, precision = 4) => {
  if (value === null || value === undefined) return 0;
  return Number(Number(value).toFixed(precision));
};

const createStableComponentList = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const screen = window.screen || {};
  const navigatorRef = window.navigator || {};
  const intlOptions = (typeof Intl !== 'undefined' && Intl.DateTimeFormat)
    ? Intl.DateTimeFormat().resolvedOptions() || {}
    : {};

  const components = [
    // Hardware / OS characteristics
    encodeForHash(navigatorRef.platform),
    encodeForHash(navigatorRef.language),
    encodeForHash(navigatorRef.languages && navigatorRef.languages.join('-')),
    encodeForHash(navigatorRef.hardwareConcurrency || 0),
    encodeForHash(navigatorRef.deviceMemory || 0),
    encodeForHash(navigatorRef.maxTouchPoints || 0),
    // Screen characteristics (rounded for stability)
    encodeForHash(screen.width || 0),
    encodeForHash(screen.height || 0),
    encodeForHash(screen.availWidth || 0),
    encodeForHash(screen.availHeight || 0),
    encodeForHash(screen.colorDepth || 0),
    encodeForHash(screen.pixelDepth || 0),
    encodeForHash(normalizeNumber(window.devicePixelRatio || 1, 3)),
    // Timezone / locale
    encodeForHash(intlOptions.timeZone || ''),
    encodeForHash(intlOptions.locale || ''),
    encodeForHash(new Date().getTimezoneOffset()),
    // Connection information (optional but stable per device)
    encodeForHash(navigatorRef.connection?.effectiveType || ''),
    encodeForHash(navigatorRef.connection?.downlink || 0),
    encodeForHash(navigatorRef.connection?.rtt || 0)
  ];

  return components;
};

const hashComponents = (components) => {
  const data = components.join('|');
  let hash = 0;
  for (let i = 0; i < data.length; i += 1) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return `device_${Math.abs(hash).toString(36)}`;
};

export const getDeviceId = () => {
  const components = createStableComponentList();
  if (!components.length) {
    return 'device_unknown';
  }
  return hashComponents(components);
};

export const getDeviceInfo = () => {
  const userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const deviceId = getDeviceId();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  let deviceType = 'Desktop';
  if (/iPhone/i.test(userAgent)) deviceType = 'iPhone';
  else if (/iPad/i.test(userAgent)) deviceType = 'iPad';
  else if (/Android/i.test(userAgent)) deviceType = 'Android';
  else if (/Windows Phone/i.test(userAgent)) deviceType = 'Windows Phone';
  else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) deviceType = 'Mac';
  else if (/Windows NT/i.test(userAgent)) deviceType = 'Windows PC';

  return {
    deviceId,
    deviceType,
    isMobile,
    userAgent
  };
};
