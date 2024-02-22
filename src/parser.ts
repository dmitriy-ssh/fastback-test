import { IPageParser, ProductInfo } from "types";

export class Parser implements IPageParser {
  pageData?: string = undefined;

  async pullPageData(productId: string): Promise<boolean> {
    if (productId === "1") {
      return true;
    }

    return false;
  }

  async parsePageData(): Promise<ProductInfo> {
    return {
      name: "Mock Product",
      brand: "Mock Brand",
      price: 29.99,
      isAvailable: true,
      isInSale: false,
      saleDescription: "No sale",
      description: "This is a mock product used for testing purposes.",
    };
  }
}
