import { ScrapRequest } from "entity/scrapRequest.entity";
import { DataSource } from "typeorm";
import {
  IPageParser,
  IRequestHandler,
  ProductInfo,
  ScrapResultError,
  ScrapResultErrorType,
} from "types";

import uuid from "uuid";

export class RequestHandler implements IRequestHandler {
  datasource: DataSource;
  parser: IPageParser;

  constructor(datasource: DataSource, parser: IPageParser) {
    this.datasource = datasource;
    this.parser = parser;
  }

  async handleProductRequest(productId: string): Promise<string | null> {
    let isPageAccessible: boolean = false;

    try {
      isPageAccessible = await this.parser.pullPageData(productId);
    } catch {}

    if (!isPageAccessible) {
      return null;
    }

    const handle = uuid.v4();

    try {
      await this.datasource.manager.create(ScrapRequest, { handle });
    } catch {
      return null;
    }

    this.parser
      .parsePageData()
      .then((info) => {
        this.datasource.manager.update(
          ScrapRequest,
          { handle },
          { result: JSON.stringify(info) }
        );
      })
      .catch(() => {});

    return handle;
  }

  async handleProductScrapResultRequest(
    handleId: string
  ): Promise<ProductInfo | ScrapResultError> {
    let requestDbData: ScrapRequest | null = null;

    try {
      requestDbData = await this.datasource.manager.findOneBy(ScrapRequest, {
        handle: handleId,
      });
    } catch {}

    if (!requestDbData) {
      return { error: ScrapResultErrorType.INVALID_HANDLE };
    }

    const secondsPassed = this.calculateTimeDeltaSeconds(
      requestDbData.started_at
    );

    if (secondsPassed < 10) {
      return { error: ScrapResultErrorType.NOT_READY };
    }

    if (requestDbData.result) {
      return JSON.parse(requestDbData.result) as ProductInfo;
    }

    return { error: ScrapResultErrorType.TIMEOUT };
  }

  private calculateTimeDeltaSeconds(date: Date) {
    const timeDiffInMillis = Math.abs(Date.now() - date.valueOf());

    return timeDiffInMillis / 1000;
  }
}
