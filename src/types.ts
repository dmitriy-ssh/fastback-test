export type ProductInfo = {
  name: string;
  brand: string;
  price: number;
  isAvailable: boolean;
  isInSale: boolean;
  saleDescription: string;
  description: string;
};

export enum ScrapResultErrorType {
  TIMEOUT = "Processing timeout",
  NOT_READY = "Scrapping result not ready",
  INVALID_HANDLE = "Invalid request handle",
}

export type ScrapResultError = {
  error: ScrapResultErrorType;
};

export interface IRequestHandler {
  /**
   * @returns request handle or null if request invalid
   */
  handleProductRequest(productId: string): Promise<string | null>;

  handleProductScrapResultRequest(
    handleId: string
  ): Promise<ScrapResultError | ProductInfo>;
}

export interface IPageParser {
  /**
   * @returns is successfull (page exists)
   */
  pullPageData(productId: string): Promise<boolean>;

  parsePageData(): Promise<ProductInfo>;
}
