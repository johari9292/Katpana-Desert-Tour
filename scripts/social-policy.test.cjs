const { test } = require("node:test");
const assert = require("node:assert/strict");
const { WEBSITE_URL, withWebsite, singleReelOperations, instagramCaption, instagramSourceOperations } = require("./social-policy.cjs");

test("Instagram receives a fresh hosted original and skips missing URLs", () => {
  const module = { id: 8, module: "instagram-business:CreateAReelPost", filter: { name: "Only today's credited Reel with a downloadable video", conditions: [[{ a: "{{7.source}}", o: "exist" }, { a: "{{1.content_date}}", o: "text:equal", b: "today" }]] } };
  const ops = instagramSourceOperations(module, { mapper: { video_url: "{{7.source}}", caption: "{{1.caption}}" } });
  assert.equal(ops[0].config.mapper.video_url, "{{1.instagram_video_url}}");
  assert.equal(ops[0].config.mapper.caption, "{{1.caption}}");
  assert.ok(ops[1].filter.conditions[0].some((item) => item.a === "{{1.instagram_video_url}}" && item.o === "text:notequal"));
  assert.ok(ops[1].filter.conditions[0].some((item) => item.a === "{{1.content_date}}"));
  assert.throws(() => instagramSourceOperations({ ...module, filter: { ...module.filter, conditions: [[]] } }, { mapper: {} }), /changed/);
});

test("website URLs are included exactly once and do not remove photo credits", () => {
  const original = "Explore Hunza. Photo: Photographer; CC BY 4.0; https://example.com/photo";
  const caption = withWebsite(original);
  assert.ok(caption.includes(WEBSITE_URL));
  assert.ok(caption.includes(original));
  assert.equal(withWebsite(caption), caption);
});

test("only the chosen Facebook reel route remains enabled, preserving photo and Instagram routes", () => {
  const modules = [
    { id: 3, module: "facebook-pages:CreatePostWithPhotos" },
    { id: 4, module: "facebook-pages:uploadAReel" },
    { id: 5, module: "facebook-pages:uploadAReel" },
    { id: 9, module: "facebook-pages:uploadAReel" },
    { id: 10, module: "instagram-business:CreateAReelPost" },
  ];
  assert.deepEqual(singleReelOperations(modules).map((operation) => operation.moduleId), [4, 9]);
  assert.throws(() => singleReelOperations([]), /Inspect/);
});

test("Instagram captions fail explicitly instead of silently truncating licence credits", () => {
  assert.ok(instagramCaption("Plan a mountain journey.").includes(WEBSITE_URL));
  assert.throws(() => instagramCaption("A".repeat(2201)), /2,200/);
});
