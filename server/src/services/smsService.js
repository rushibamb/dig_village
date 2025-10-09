const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send SMS OTP to a mobile number
 * @param {string} mobileNumber - The mobile number to send OTP to (with country code)
 * @param {string} otp - The OTP to send
 * @returns {Promise<Object>} Twilio message object
 */
const sendSMSOTP = async (mobileNumber, otp) => {
  try {
    // Ensure mobile number has country code (default to India +91 if not provided)
    let formattedNumber = mobileNumber;
    if (!mobileNumber.startsWith('+')) {
      // If it starts with 0, remove it and add +91
      if (mobileNumber.startsWith('0')) {
        formattedNumber = '+91' + mobileNumber.substring(1);
      } else {
        // Add +91 prefix
        formattedNumber = '+91' + mobileNumber;
      }
    }

    const message = await client.messages.create({
      body: `Your OTP for village portal verification is: ${otp}. This OTP is valid for 10 minutes. Do not share this OTP with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    console.log('SMS sent successfully:', message.sid);
    return {
      success: true,
      messageId: message.sid,
      formattedNumber: formattedNumber
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify if Twilio is properly configured
 * @returns {boolean} True if configured, false otherwise
 */
const isTwilioConfigured = () => {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== 'paste_your_account_sid_here' &&
    process.env.TWILIO_AUTH_TOKEN !== 'paste_your_auth_token_here' &&
    process.env.TWILIO_PHONE_NUMBER !== 'paste_your_twilio_phone_number_here'
  );
};

/**
 * Send OTP and return the generated OTP for storage
 * @param {string} mobileNumber - The mobile number to send OTP to
 * @returns {Promise<Object>} Result object with OTP and success status
 */
const sendOTPToMobile = async (mobileNumber) => {
  try {
    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
      console.warn('Twilio not configured. Returning mock OTP for development.');
      const mockOTP = generateOTP();
      return {
        success: true,
        otp: mockOTP,
        isMock: true,
        message: 'Mock OTP generated for development'
      };
    }

    // Generate OTP
    const otp = generateOTP();

    // Send SMS
    const smsResult = await sendSMSOTP(mobileNumber, otp);

    if (smsResult.success) {
      return {
        success: true,
        otp: otp,
        isMock: false,
        messageId: smsResult.messageId,
        formattedNumber: smsResult.formattedNumber
      };
    } else {
      return {
        success: false,
        error: smsResult.error
      };
    }
  } catch (error) {
    console.error('Error in sendOTPToMobile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateOTP,
  sendSMSOTP,
  sendOTPToMobile,
  isTwilioConfigured
};
