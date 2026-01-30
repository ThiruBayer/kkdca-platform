import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JuspaySessionResponse {
  status: string;
  id: string;
  order_id: string;
  payment_links?: {
    web?: string;
    mobile?: string;
    iframe?: string;
  };
  sdk_payload?: any;
}

export interface JuspayOrderStatusResponse {
  status: string;
  order_id: string;
  txn_id?: string;
  amount: number;
  status_id: number;
  payment_method_type?: string;
  payment_method?: string;
}

@Injectable()
export class JuspayService {
  private readonly logger = new Logger(JuspayService.name);
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;
  private readonly merchantId: string;
  private readonly paymentPageClientId: string;

  constructor(private configService: ConfigService) {
    this.apiBaseUrl = this.configService.get<string>(
      'JUSPAY_API_BASE_URL',
      'https://smartgateway.hdfcbank.in',
    );
    this.apiKey = this.configService.get<string>('JUSPAY_API_KEY', '');
    this.merchantId = this.configService.get<string>('JUSPAY_MERCHANT_ID', '');
    this.paymentPageClientId = this.configService.get<string>(
      'JUSPAY_PAYMENT_PAGE_CLIENT_ID',
      'hdfcmaster',
    );
  }

  private getAuthHeader(): string {
    const encoded = Buffer.from(`${this.apiKey}:`).toString('base64');
    return `Basic ${encoded}`;
  }

  async createSession(params: {
    orderId: string;
    amount: number;
    customerEmail: string;
    customerPhone: string;
    customerId: string;
    firstName?: string;
    lastName?: string;
    returnUrl: string;
    description?: string;
  }): Promise<JuspaySessionResponse> {
    const body = {
      order_id: params.orderId,
      amount: params.amount.toFixed(2),
      currency: 'INR',
      customer_id: params.customerId,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      payment_page_client_id: this.paymentPageClientId,
      action: 'paymentPage',
      return_url: params.returnUrl,
      description: params.description || 'Complete your payment',
      ...(params.firstName && { first_name: params.firstName }),
      ...(params.lastName && { last_name: params.lastName }),
    };

    this.logger.log(`Creating Juspay session for order: ${params.orderId}`);

    const response = await fetch(`${this.apiBaseUrl}/session`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        'x-merchantid': this.merchantId,
        'x-customerid': params.customerId,
        'version': '2023-06-30',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Juspay session creation failed: ${response.status} - ${errorText}`);
      throw new Error(`Juspay session creation failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    this.logger.log(`Juspay session created successfully for order: ${params.orderId}`);
    return data;
  }

  async getOrderStatus(orderId: string): Promise<JuspayOrderStatusResponse> {
    this.logger.log(`Fetching order status for: ${orderId}`);

    const response = await fetch(
      `${this.apiBaseUrl}/orders/${orderId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-merchantid': this.merchantId,
        },
        body: '',
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Juspay order status failed: ${response.status} - ${errorText}`);
      throw new Error(`Juspay order status failed: ${response.status}`);
    }

    return response.json();
  }

  isPaymentSuccess(statusId: number): boolean {
    // Juspay status_id 21 = CHARGED (success)
    return statusId === 21;
  }

  isPaymentFailed(statusId: number): boolean {
    // status_id 23 = AUTHENTICATION_FAILED, 26 = AUTHORIZATION_FAILED, 27 = JUSPAY_DECLINED
    return [23, 26, 27, 28, 29, 30].includes(statusId);
  }

  isPaymentPending(statusId: number): boolean {
    // status_id 10 = NEW, 20 = PENDING_VBV
    return [10, 20].includes(statusId);
  }
}
