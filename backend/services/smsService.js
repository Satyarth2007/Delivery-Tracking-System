/**
 * SMS service wrapper — currently a stub that logs to console.
 * Replace the internals with actual Twilio/MSG91 API calls once
 * the provider is finalized. The function signature stays the same,
 * so no other code needs to change later.
 */
async function sendSMS(phone, message) {
  // TODO: Replace with real Twilio/MSG91 integration
  console.log(`[SMS STUB] To: ${phone} | Message: ${message}`);
  return { success: true };
}

export { sendSMS };