import { describe, expect, it } from "vitest";
import { parseImageUrls, serializeImageUrls } from "@/lib/project-images";

describe("parseImageUrls", () => {
  it("lit un tableau JSON valide", () => {
    expect(parseImageUrls('["/a.png","/b.png"]', null)).toEqual([
      "/a.png",
      "/b.png",
    ]);
  });

  it("retombe sur imageUrl si le JSON est corrompu", () => {
    // Sans cette garde, un JSON.parse nu faisait planter le rendu de la page.
    expect(parseImageUrls("{pas du json", "/cover.png")).toEqual(["/cover.png"]);
  });

  it("ignore les entrées non textuelles", () => {
    expect(parseImageUrls('["/a.png",null,42,""]', null)).toEqual(["/a.png"]);
  });

  it("renvoie un tableau vide quand il n'y a rien", () => {
    expect(parseImageUrls(null, null)).toEqual([]);
  });

  it("sérialise en null quand la liste est vide", () => {
    expect(serializeImageUrls([])).toBeNull();
    expect(serializeImageUrls(["/a.png"])).toBe('["/a.png"]');
  });
});
