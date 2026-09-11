import { describe, expect, it } from "vitest";

import { parseCsv, serializeCsv } from "../app/eventReviewCsv";

describe("event review CSV", () => {
  it("parses quoted commas, quotes and line breaks", () => {
    const csv = 'id,text\r\n1,"Texto, con coma"\r\n2,"Dice ""hola""\ny sigue"';

    expect(parseCsv(csv)).toEqual({
      headers: ["id", "text"],
      rows: [
        ["1", "Texto, con coma"],
        ["2", 'Dice "hola"\ny sigue'],
      ],
    });
  });

  it("serializes data without changing its columns", () => {
    const document = {
      headers: ["event_id", "title"],
      rows: [["academy-test", "Prueba, uno"]],
    };

    expect(parseCsv(serializeCsv(document))).toEqual(document);
  });
});
