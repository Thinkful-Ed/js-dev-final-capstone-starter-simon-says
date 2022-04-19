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

describe("US-02: setLevel()", () => {
  beforeEach(setUpTest);

  it("should set level of the game to default if called with no argument", async () => {
    const maxRoundCount = await page.evaluate(async () => {
      return window.setLevel();
    });
    expect(maxRoundCount).toEqual(8);
  });

  it("should correctly set the level of the game if called with a valid argument", async () => {
    const maxRoundCount = await page.evaluate(() => {
      return window.setLevel(2);
    });
    expect(maxRoundCount).toEqual(14);
  });

  it("should return an error message if called with invalid argument", async () => {
    const error = await page.evaluate(() => {
      return window.setLevel(8);
    });
    expect(typeof error).toBe("string");
  });
});

describe("US-02: startButtonHandler()", () => {
  beforeEach(setUpTest);

  it("should hide the start button", async () => {
    const classList = await page.evaluate(() => {
      return window.startButtonHandler().startButton.classList;
    });
    expect(Object.values(classList)).toContain("hidden");
  });

  it("should unhide the status text", async () => {
    const classList = await page.evaluate(() => {
      return window.startButtonHandler().statusSpan.classList;
    });
    expect(Object.values(classList)).not.toContain("hidden");
  });

  it("should call `setLevel()`", async () => {
    const startButtonHandler = await page.evaluate(() => {
      return window.startButtonHandler.toString();
    });
    expect(startButtonHandler).toContain("setLevel()");
  });

  it("should call `playComputerTurn()`", async () => {
    const startButtonHandler = await page.evaluate(() => {
      return window.startButtonHandler.toString();
    });
    expect(startButtonHandler).toContain("playComputerTurn()");
  });
});

describe("US-02: getRandomItem()", () => {
  beforeEach(setUpTest);

  it("should return null if getRandomItem([])", async () => {
    const randomItem = await page.evaluate(() => {
      return window.getRandomItem([]);
    });
    expect(randomItem).toBeNull();
  });
});
