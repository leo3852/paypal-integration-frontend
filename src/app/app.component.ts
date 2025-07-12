import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { PaymentComponent } from "./components/payment/payment.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [PaymentComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'paypal-integration';
  sdkkLoaded: boolean = false;

  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = `${environment.paypal.sdkUrl}?client-id=${environment.paypal.clientId}&currency=${environment.paypal.currency}&components=${environment.paypal.components}&enable-funding=${environment.paypal.enableFunding}&disable-funding=${environment.paypal.disableFunding}`;
    script.async = true;
    
    console.log('Loading PayPal SDK:', script.src);
    //testing lines
    script.onload = () => {     
       
      this.sdkkLoaded = true;
    };

    // script.onerror = () => {
    //   console.error('Failed to load PayPal SDK');
    // };

    document.head.appendChild(script);
  }
}
