// Device fingerprinting for mobile devices
// Creates a unique identifier for each device

export const generateDeviceFingerprint = () => {
  // Get device information
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  // Collect device characteristics
  const fingerprint = {
    // Screen information
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    
    // Browser information
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    
    // Timezone
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // Canvas fingerprint
    canvasFingerprint: canvas.toDataURL(),
    
    // Touch support
    touchSupport: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // Hardware concurrency
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    
    // Device memory (if available)
    deviceMemory: navigator.deviceMemory || 0,
    
    // Connection information
    connectionType: navigator.connection?.effectiveType || 'unknown',
    
    // Timestamp for uniqueness
    timestamp: Date.now()
  };
  
  // Create a hash from the fingerprint
  const fingerprintString = JSON.stringify(fingerprint);
  return btoa(fingerprintString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

// Get or create device ID
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    deviceId = generateDeviceFingerprint();
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

// Check if device has already clicked
export const hasDeviceClicked = () => {
  return localStorage.getItem('hasClicked') === 'true';
};

// Mark device as having clicked
export const markDeviceAsClicked = () => {
  localStorage.setItem('hasClicked', 'true');
};

// Get device info for display
export const getDeviceInfo = () => {
  const deviceId = getDeviceId();
  const userAgent = navigator.userAgent;
  
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Get device type
  let deviceType = 'Desktop';
  if (/iPhone/i.test(userAgent)) deviceType = 'iPhone';
  else if (/iPad/i.test(userAgent)) deviceType = 'iPad';
  else if (/Android/i.test(userAgent)) deviceType = 'Android';
  else if (/Windows Phone/i.test(userAgent)) deviceType = 'Windows Phone';
  
  return {
    deviceId: deviceId.substring(0, 8) + '...', // Show only first 8 chars
    deviceType,
    isMobile,
    hasClicked: hasDeviceClicked()
  };
};
