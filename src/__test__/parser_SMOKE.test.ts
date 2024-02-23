import { ProductInfo } from "src/types";
import { Parser } from "../parser";

describe("Parser Smoke test", () => {
  it("should parse a product successfully from nike site", async () => {
    const parser = new Parser();

    const isSuccessful = await parser.pullPageData(
      "offcourt-colorado-rockies-slide-B2ZZsZ/DH6991-001"
    );

    expect(isSuccessful).toEqual(true);

    const parseResult = await parser.parsePageData();

    expect(parseResult).toMatchObject<ProductInfo>({
      brand: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      isAvailable: expect.any(Boolean),
      isInSale: expect.any(Boolean),
      price: expect.any(Number),
      saleDescription: expect.any(String),
    });
  });
});
