import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import { getFileType } from "./fileHandlers";

describe("getFileType", () => {
  it('returns "viewable" for PDF files', () => {
    expect(getFileType("report.pdf")).toBe("viewable");
    expect(getFileType("REPORT.PDF")).toBe("viewable");
  });

  it('returns "viewable" for image files', () => {
    expect(getFileType("photo.png")).toBe("viewable");
    expect(getFileType("scan.jpg")).toBe("viewable");
    expect(getFileType("image.jpeg")).toBe("viewable");
    expect(getFileType("IMAGE.JPEG")).toBe("viewable");
  });

  it('returns "office" for Word documents', () => {
    expect(getFileType("document.doc")).toBe("office");
    expect(getFileType("document.docx")).toBe("office");
  });

  it('returns "office" for Excel files', () => {
    expect(getFileType("data.xls")).toBe("office");
    expect(getFileType("data.xlsx")).toBe("office");
  });

  it('returns "other" for unrecognized file types', () => {
    expect(getFileType("archive.zip")).toBe("other");
    expect(getFileType("readme.txt")).toBe("other");
    expect(getFileType("video.mp4")).toBe("other");
    expect(getFileType("noextension")).toBe("other");
  });
});
