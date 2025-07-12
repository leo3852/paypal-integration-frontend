export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  paypal: {
    sdkUrl: 'https://www.paypal.com/sdk/js',
    clientId: 'Aehr-KLMdRUZY1m0-_8GqwVNSKTpu85qan79ZFlD6H0zjo_r-rl1zgb9lW6go1uP-iDZh7yerWpO0FNw',
    currency: 'EUR',
    // components: 'buttons,hosted-fields',
    components: 'buttons',
    enableFunding: 'paylater,card',
    disableFunding: 'venmo'
  }
};


//<script src="https://www.paypal.com/sdk/js?
// client-id=Aehr-KLMdRUZY1m0-_8GqwVNSKTpu85qan79ZFlD6H0zjo_r-rl1zgb9lW6go1uP-iDZh7yerWpO0FNw
// &currency=EUR
// &components=buttons
// &enable-funding=paylater,card
// &disable-funding=venmo"></script>