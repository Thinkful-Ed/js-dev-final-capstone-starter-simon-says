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

describe("US-04: playHumanTurn()", () => {
  beforeEach(setUpTest);

  it("should render the pad container clickable", async () => {
    const classList = await page.evaluate(() => {
      window.playHumanTurn();
      return document.querySelector(".js-pad-container").classList;
    });
    expect(Object.values(classList)).not.toContain("unclickable");
  });

  it("should update the status text", async () => {
    const status = await page.evaluate(() => {
      window.playHumanTurn();
      return document.querySelector(".js-status").textContent;
    });
    expect(status).toMatch(/player/i);
  });
});

describe("US-04: checkPress(color)", () => {
  beforeEach(setUpTest);

  it("should call resetGame()", async () => {
    const checkPress = await page.evaluate(() => {
      return window.checkPress.toString();
    });
    expect(checkPress).toContain("resetGame");
  });

  it("should call checkRound()", async () => {
    const checkPress = await page.evaluate(() => {
      return window.checkPress.toString();
    });
    expect(checkPress).toContain("checkRound()");
  });
});

describe("US-04: checkRound()", () => {
  beforeEach(setUpTest);

  it("should call resetGame()", async () => {
    const checkRound = await page.evaluate(() => {
      return window.checkRound.toString();
    });
    expect(checkRound).toContain("resetGame");
  });

  it("should call playComputerTurn()", async () => {
    const checkRound = await page.evaluate(() => {
      return window.checkRound.toString();
    });
    expect(checkRound).toContain("playComputerTurn");
  });
});

describe("US-04: padHandler()", () => {
  beforeEach(setUpTest);

  it("should return undefined if `color` is undefined", async () => {
    const output = await page.evaluate(() => {
      return window.padHandler({ target: { dataset: {} } });
    });
    expect(output).not.toBeDefined();
  });

  it("should call `sound.play()`", async () => {
    const padHandler = await page.evaluate(() => {
      return window.padHandler.toString();
    });
    expect(padHandler).toContain("sound.play()");
  });

  it("should call `checkPress(color)`", async () => {
    const padHandler = await page.evaluate(() => {
      return window.padHandler.toString();
    });
    expect(padHandler).toContain("checkPress(color)");
  });
});
