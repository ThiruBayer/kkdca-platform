import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as crypto from 'crypto';

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
  private readonly responseKey: string;

  constructor(private configService: ConfigService) {
    this.apiBaseUrl = this.configService.get<string>(
      'HDFC_BASE_URL',
      this.configService.get<string>(
        'JUSPAY_API_BASE_URL',
        'https://smartgateway.hdfcuat.bank.in',
      ),
    );
    this.apiKey = this.configService.get<string>(
      'HDFC_API_KEY',
      this.configService.get<string>('JUSPAY_API_KEY', ''),
    );
    this.merchantId = this.configService.get<string>(
      'HDFC_MERCHANT_ID',
      this.configService.get<string>('JUSPAY_MERCHANT_ID', ''),
    );
    this.paymentPageClientId = this.configService.get<string>(
      'HDFC_PAYMENT_PAGE_CLIENT_ID',
      this.configService.get<string>('JUSPAY_PAYMENT_PAGE_CLIENT_ID', ''),
    );
    this.responseKey = this.configService.get<string>(
      'HDFC_RESPONSE_KEY',
      this.configService.get<string>('JUSPAY_RESPONSE_KEY', ''),
    );
  }

  private getAuthHeader(): string {
    return 'Basic ' + Buffer.from(this.apiKey + ':').toString('base64');
  }

  /**
   * Create order session - matches official HDFC NodejsBackendKit /session endpoint
   */
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
    const body: Record<string, any> = {
      order_id: params.orderId,
      amount: params.amount,
      currency: 'INR',
      return_url: params.returnUrl,
      customer_id: params.customerId,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      payment_page_client_id: this.paymentPageClientId,
      action: 'paymentPage',
      description: params.description || 'KKDCA Payment',
      ...(params.firstName && { first_name: params.firstName }),
      ...(params.lastName && { last_name: params.lastName }),
    };

    this.logger.log(`Creating HDFC session for order: ${params.orderId}`);

    const data = await this.makeServiceCall<JuspaySessionResponse>({
      method: 'POST',
      path: '/session',
      body,
      contentType: 'application/json',
      extraHeaders: {
        'x-customerid': params.customerId,
      },
    });

    this.logger.log(`HDFC session created for order: ${params.orderId}, payment_link: ${data.payment_links?.web ? 'yes' : 'no'}`);
    return data;
  }

  /**
   * Get order status - uses POST as per HDFC API docs
   */
  async getOrderStatus(orderId: string): Promise<JuspayOrderStatusResponse> {
    this.logger.log(`Fetching order status for: ${orderId}`);

    const data = await this.makeServiceCall<JuspayOrderStatusResponse>({
      method: 'POST',
      path: `/orders/${orderId}`,
    });

    this.logger.log(`Order status for ${orderId}: ${data.status}`);
    return data;
  }

  /**
   * Initiate refund - matches official HDFC NodejsBackendKit POST /refunds
   */
  async refund(params: {
    orderId: string;
    amount: number;
    uniqueRequestId?: string;
  }): Promise<any> {
    this.logger.log(`Initiating refund for order: ${params.orderId}, amount: ${params.amount}`);

    return this.makeServiceCall({
      method: 'POST',
      path: '/refunds',
      body: {
        order_id: params.orderId,
        amount: params.amount,
        unique_request_id: params.uniqueRequestId || `refund_${Date.now()}`,
      },
      contentType: 'application/json',
    });
  }

  /**
   * Validate HMAC SHA256 signature from HDFC callback response
   * Matches official HDFC NodejsBackendKit validateHMAC_SHA256
   */
  validateSignature(params: Record<string, any>): boolean {
    if (!this.responseKey) {
      this.logger.warn('HDFC_RESPONSE_KEY not configured, skipping signature validation');
      return true;
    }

    try {
      const paramsList: Record<string, string> = {};
      for (const key in params) {
        if (key !== 'signature' && key !== 'signature_algorithm') {
          paramsList[key] = params[key];
        }
      }

      const sortedKeys = Object.keys(paramsList).sort();
      const sortedParams: Record<string, string> = {};
      for (const key of sortedKeys) {
        sortedParams[key] = paramsList[key];
      }

      let paramsString = '';
      for (const key in sortedParams) {
        paramsString += `${key}=${sortedParams[key]}&`;
      }
      paramsString = paramsString.slice(0, -1); // remove trailing &

      const encodedParams = encodeURIComponent(paramsString);
      const computedHmac = crypto
        .createHmac('sha256', this.responseKey)
        .update(encodedParams)
        .digest('base64');
      const receivedHmac = decodeURIComponent(params.signature || '');

      const isValid = decodeURIComponent(computedHmac) === receivedHmac;
      if (!isValid) {
        this.logger.error('HDFC signature validation failed');
      }
      return isValid;
    } catch (error: any) {
      this.logger.error(`Signature validation error: ${error.message}`);
      return false;
    }
  }

  isPaymentSuccess(statusOrId: string | number): boolean {
    if (typeof statusOrId === 'string') {
      return statusOrId === 'CHARGED';
    }
    return statusOrId === 21;
  }

  isPaymentFailed(statusOrId: string | number): boolean {
    if (typeof statusOrId === 'string') {
      return ['AUTHORIZATION_FAILED', 'AUTHENTICATION_FAILED', 'JUSPAY_DECLINED'].includes(statusOrId);
    }
    return [23, 26, 27, 28, 29, 30].includes(statusOrId);
  }

  isPaymentPending(statusOrId: string | number): boolean {
    if (typeof statusOrId === 'string') {
      return ['PENDING', 'PENDING_VBV', 'NEW'].includes(statusOrId);
    }
    return [10, 20].includes(statusOrId);
  }

  /**
   * Core HTTP call - matches official HDFC PaymentHandler.makeServiceCall
   */
  private makeServiceCall<T>(options: {
    method: string;
    path: string;
    body?: Record<string, any>;
    contentType?: string;
    extraHeaders?: Record<string, string>;
  }): Promise<T> {
    return new Promise((resolve, reject) => {
      const headers: Record<string, string> = {
        'Content-Type': options.contentType || 'application/x-www-form-urlencoded',
        'User-Agent': 'NODEJS_KIT/1.0.0',
        'version': '2023-06-30',
        'x-merchantid': this.merchantId,
        'Authorization': this.getAuthHeader(),
        ...(options.extraHeaders || {}),
      };

      let payload = '';
      if (options.body) {
        if (headers['Content-Type'] === 'application/json') {
          payload = JSON.stringify(options.body);
        } else {
          payload = Object.keys(options.body)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options.body![key])}`)
            .join('&');
        }
      }

      const fullUrl = new URL(options.path, this.apiBaseUrl);
      const agent = new https.Agent({ keepAlive: true });

      const httpOptions = {
        host: fullUrl.host,
        port: fullUrl.port || undefined,
        path: fullUrl.pathname + fullUrl.search,
        method: options.method,
        agent,
        headers,
      };

      this.logger.debug(`HDFC API: ${options.method} ${fullUrl.pathname}`);

      const req = https.request(httpOptions);

      req.setTimeout(100000, () => {
        req.destroy(new Error('HDFC API request timeout'));
      });

      req.on('response', (res) => {
        res.setEncoding('utf-8');
        let responseBody = '';
        res.on('data', (chunk: string) => {
          responseBody += chunk;
        });

        res.once('end', () => {
          this.logger.debug(`HDFC API response: ${res.statusCode} - ${responseBody.substring(0, 200)}`);

          let resJson: any;
          try {
            resJson = JSON.parse(responseBody);
          } catch {
            this.logger.error(`HDFC API invalid JSON response: ${responseBody.substring(0, 500)}`);
            return reject(new Error(`Invalid response from HDFC gateway`));
          }

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            return resolve(resJson as T);
          } else {
            const errorMsg = resJson.error_message || resJson.message || `HTTP ${res.statusCode}`;
            this.logger.error(`HDFC API error: ${res.statusCode} - ${errorMsg}`);
            return reject(new Error(`HDFC gateway error: ${errorMsg}`));
          }
        });
      });

      req.once('socket', (socket: any) => {
        if (socket.connecting) {
          socket.once('secureConnect', () => {
            req.write(payload);
            req.end();
          });
        } else {
          req.write(payload);
          req.end();
        }
      });

      req.on('error', (error: Error) => {
        this.logger.error(`HDFC API connection error: ${error.message}`);
        return reject(error);
      });
    });
  }
}
