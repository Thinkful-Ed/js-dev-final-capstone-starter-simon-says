const baseURL = process.env.TEST_BASE_URL || "http://localhost:3000";

const msgs = [];
// Show logs from the page inside labeled container.
const onPageConsole = (msg) => {
  console.log(
    `<LOG::page console.${msg.type()}>${msg.text().replace(/\n/g, "<:LF:>")}`
  );
  msgs.push(msg.text());
};

const setUpTest = async () => {
  page.on("console", onPageConsole);
  page.on("pageerror", (err) => console.log(err));
  await page.goto(baseURL, { waitUntil: "load" });
};

describe("US-05: resetGame(text)", () => {
  beforeEach(setUpTest);

  it("should call `alert(text)`", async () => {
    const resetGame = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGame).toContain("alert(text)");
  });

  it("should use `setText(heading, 'Simon Says')` to reset the heading to `Simon Says`", async () => {
    const resetGame = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGame).toContain('setText(heading, "Simon Says")');
  });

  it("should use `startButton.classList.remove('hidden')` to show the start button", async () => {
    const resetGame = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGame).toContain('startButton.classList.remove("hidden")');
  });

  it("should use `statusSpan.classList.add('hidden')` hide the status message", async () => {
    const resetGame = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGame).toContain('statusSpan.classList.add("hidden")');
  });

  it("should use `padContainer.classList.add('unclickable')` to render the pads unclickable", async () => {
    const resetGame = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGame).toContain('padContainer.classList.add("unclickable")');
  });
});
