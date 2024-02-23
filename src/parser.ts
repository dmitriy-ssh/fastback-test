import axios from "axios";
import { IPageParser, IPageParserFactory, ProductInfo } from "./types";

const NIKE_URL_PREFIX = "https://nike.com/t/";

export class Parser implements IPageParser {
  pageData?: string = undefined;
  productId: string | undefined = undefined;

  async pullPageData(productId: string): Promise<boolean> {
    this.productId = productId;

    try {
      this.pageData = await this.getHtmlPageFromWeb(productId);
    } catch {}

    return !!this.pageData;
  }

  async parsePageData(): Promise<ProductInfo> {
    if (!this.productId) {
      throw new Error("Must pull data first");
    }

    const nextData = this.extractNextData(this.pageData ?? "");

    if (!nextData) {
      throw new Error("Next data cannot be parsed");
    }

    const exactProductId = this.productId.split("/")[1];

    const productData =
      nextData["props"]["pageProps"]["initialState"]["Threads"]["products"][
        exactProductId
      ];

    return {
      name: productData?.title ?? "",
      brand: productData?.brand ?? "",
      price: productData?.currentPrice ?? 1,
      isAvailable: productData?.seoProductAvailability ?? false,
      isInSale: productData?.discounted ?? false,
      saleDescription: this.calculatePercentDiscount(
        productData?.currentPrice ?? 1,
        productData?.fullPrice ?? 1
      ),
      description: productData?.descriptionPreview ?? "",
    };
  }

  private async getHtmlPageFromWeb(urlSuffix: string) {
    const req = await axios.get(NIKE_URL_PREFIX + urlSuffix);
    return req.data as string;
  }

  private extractNextData(html: string) {
    const regex = new RegExp(
      `<script(?:\\s+[\\w-]+="[^"]*")*\\s+id="__NEXT_DATA__"(?:\\s+[\\w-]+="[^"]*")*>(.*?)<\\/script>`,
      "s"
    );

    const match = html.match(regex);

    try {
      return JSON.parse(match?.[1] as string);
    } catch {
      return null;
    }
  }

  private calculatePercentDiscount(
    currentPrice: number,
    fullPrice: number
  ): string {
    const delta = fullPrice - currentPrice;
    if (!delta) {
      return "No sale";
    }
    const percentage = (delta / fullPrice) * 100;
    return `-${Math.round(percentage)}%`;
  }
}

export class ParserFactory implements IPageParserFactory {
  createParser(): IPageParser {
    return new Parser();
  }
}
