import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var paypal: any;

@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  transactionId: string = '';
  status: string = '';
  productImage = 'assets/product.png'; 
  userMessage: string = '';

  ngOnInit(): void {
    if (typeof paypal === 'undefined') {
      console.error('PayPal SDK is not loaded yet');
      return;
    }

    paypal.Buttons({
      style: {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal"
      },
      createOrder: async () => {
        try {
          const response = await fetch(`${environment.apiBaseUrl}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: {} })
          });
          const data = await response.json();
          return data.id;
        } catch (error) {
          console.error('Error creating order:', error);
        }
      },
      onApprove: async (data: any) => {
        try {
          const response = await fetch(`${environment.apiBaseUrl}/orders/${data.orderID}/capture`, {
            method: 'POST',
          });
          const captureData = await response.json();
          this.transactionId = captureData.id;
          this.status = captureData.status;
          this.userMessage = 'Payment successful!';
          console.log('Capture result:', captureData);
        } catch (error) {
          console.error('Error capturing order:', error);
        }
      },
      onCancel: () => {
        this.status = 'Cancelled';
        this.userMessage = 'Transaction cancelled, try again.';
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        this.status = 'Error';
      }
    }).render('#paypal-button-container');


    //initializeCardFields() advanced integration with braintree

  }


    // --- REFUND ---
    async refundPayment() {
      if (!this.transactionId) {
        this.userMessage = '';
        return;
      }

      try {
        const response = await fetch(`${environment.apiBaseUrl}/orders/${this.transactionId}/refund`, {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error refunding order');
        }

        const refundResult = await response.json();
        console.log('Refund successful:', refundResult);
        this.userMessage = `Refund successful! Refund ID: ${refundResult.id || 'N/A'}`;
        this.status = 'REFUNDED';
      } catch (error: any) {
        console.error('Error refunding payment:', error);
        this.userMessage = error.message || 'Error refunding payment.';
        this.status = 'REFUND_FAILED';
      }
    }

    //initialize card fields advanced integration with backend 
    async initializeCardFields() {
      try {
        
        //get token first from backend
        const tokenResponse = await fetch(`${environment.apiBaseUrl}/generate-token`, {
          method: 'POST',
        });
        const tokenData = await tokenResponse.json();
        console.log(tokenData);
        
        if (!tokenData.client_token) {
          console.error('No client token received');
          this.userMessage = 'could not initialize card fields.';
          return;
        }

        
        if (!paypal.HostedFields) {
          console.error('paypal.HostedFields is not available');
          return;
        }
        //fields rendering
        paypal.HostedFields.render({
          //pass client token
          authorization: tokenData.client_token,
          createOrder: async () => {
            const response = await fetch(`${environment.apiBaseUrl}/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            return data.id;
          },
          styles: {
            input: {
              'font-size': '16px',
              'color': '#3A3A3A',
            },
            '.invalid': { color: 'red' },
          },
          fields: {
            number: {
              selector: '#card-number-field-container',
              placeholder: '4111 1111 1111 1111',
            },
            cvv: {
              selector: '#card-cvv-field-container',
              placeholder: '123',
            },
            expirationDate: {
              selector: '#card-expiry-field-container',
              placeholder: 'MM/YY',
            },
          },
        }).then((hostedFieldsInstance: any) => {
          const submitButton = document.getElementById('card-field-submit-button');
  
          if (submitButton) {
            submitButton.addEventListener('click', () => {
              hostedFieldsInstance.submit().then(() => {
                this.userMessage = 'Payment successful!';
                this.status = 'COMPLETED';
              }).catch((err: any) => {
                console.error('Card error:', err);
                this.userMessage = 'Card payment failed.';
                this.status = 'FAILED';
              });
            });
          }
        }).catch((err: any) => {
          console.error('Failed to render Hosted Fields:', err);
          this.userMessage = 'Failed to initialize card fields.';
        });
  
      } catch (error) {
        console.error('Error initializing card fields:', error);
        this.userMessage = 'Unexpected error occurred.';
      }
    }
  
}
