// Server-side Twilio configuration
export const twilioConfig = {
  accountSid: 'AC4fe3d041a6e3671f6a3e41553bef4272',
  authToken: 'dbf47fcb11ff8fb04a1df70068ec75ba',
  phoneNumber: '+16416148636'
};

console.log('🔧 Twilio Config Loaded:');
console.log('Account SID:', twilioConfig.accountSid.substring(0, 10) + '...');
console.log('Phone Number:', twilioConfig.phoneNumber);
