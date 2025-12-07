declare module "@paystack/inline-js" {
  /**
   * Transaction success data from Paystack
   */
  export interface PaystackSuccessData {
    status: string;
    message: string;
    reference: string;
    [key: string]: unknown;
  }

  /**
   * Error object from Paystack
   */
  export interface PaystackError {
    message: string;
    code?: string;
    [key: string]: unknown;
  }

  /**
   * Transaction configuration options
   */
  export interface PaystackTransactionConfig {
    key: string;
    email: string;
    amount: number;
    reference?: string;
    currency?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;

    metadata?: Record<string, unknown>;

    onSuccess?: (data: PaystackSuccessData) => void;
    onCancel?: () => void;
    onLoad?: (data: Record<string, unknown>) => void;
    onError?: (error: PaystackError) => void;
  }

  export default class Paystack {
    constructor();
    newTransaction(config: PaystackTransactionConfig): void;
  }
}
