await page.emulateTimezone(fingerprint.timezone);

  await page.evaluateOnNewDocument((language) => {
    Object.defineProperty(navigator, 'language', { get: () => language });
    Object.defineProperty(navigator, 'languages', { get: () => [language] });
  }, fingerprint.language);

  await page.evaluateOnNewDocument((platform) => {
    Object.defineProperty(navigator, 'platform', { get: () => platform });
  }, fingerprint.platform);

  await page.evaluateOnNewDocument((hardwareConcurrency, deviceMemory) => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => hardwareConcurrency });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => deviceMemory });
  }, fingerprint.hardwareConcurrency, fingerprint.deviceMemory);

  await page.evaluateOnNewDocument((screenResolution) => {
    window.screen = {
      width: screenResolution.width,
      height: screenResolution.height,
      availWidth: screenResolution.width,
      availHeight: screenResolution.height
    };
  }, fingerprint.screenResolution);

  await page.evaluateOnNewDocument((cpuClass, colorDepth) => {
    Object.defineProperty(navigator, 'cpuClass', { get: () => cpuClass });
    Object.defineProperty(screen, 'colorDepth', { get: () => colorDepth });
  }, fingerprint.cpuClass, fingerprint.colorDepth);

  await page.evaluateOnNewDocument((maxTouchPoints) => {
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => maxTouchPoints });
  }, fingerprint.maxTouchPoints);