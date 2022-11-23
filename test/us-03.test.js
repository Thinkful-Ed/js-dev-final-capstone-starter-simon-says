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

describe("US-03: setText()", () => {
  beforeEach(setUpTest);

  it("should correctly set the text of a given element", async () => {
    const heading = await page.evaluate(() => {
      const heading = document.querySelectorAll(".js-heading");
      return window.setText(heading, "hello");
    });
    expect(heading.textContent).toEqual("hello");
  });
});

describe("US-03: activatePad(color)", () => {
  beforeEach(setUpTest);

  it("should activate the correct pad given a color", async () => {
    const classList = await page.evaluate(() => {
      window.activatePad("red");
      return document.querySelector(".js-pad-red").classList;
    });
    expect(Object.values(classList)).toContain("activated");
  });

  it("should call `pad.sound.play()`", async () => {
    const activatePad = await page.evaluate(() => {
      return window.activatePad.toString();
    });
    expect(activatePad).toContain("pad.sound.play()");
  });

  it("should deactivate the pad after 500 ms", async () => {
    const initialClassList = await page.evaluate(() => {
      window.activatePad("red");
      return document.querySelector(".js-pad-red").classList;
    });
    expect(Object.values(initialClassList)).toContain("activated");
    await page.waitForTimeout(1500);
    const classList = await page.evaluate(() => {
      return document.querySelector(".js-pad-red").classList;
    });
    expect(Object.values(classList)).not.toContain("activated");
  });
});

describe("US-03: activatePads(sequence)", () => {
  beforeEach(setUpTest);

  it("should call `activatePad()`", async () => {
    const activatePads = await page.evaluate(() => {
      return window.activatePads.toString();
    });
    expect(activatePads).toContain("activatePad");
  });
});

describe("US-03: playComputerTurn()", () => {
  beforeEach(setUpTest);

  it("should render the pad container unclickable", async () => {
    const classList = await page.evaluate(() => {
      window.playComputerTurn();
      return document.querySelector(".js-pad-container").classList;
    });
    expect(Object.values(classList)).toContain("unclickable");
  });

  it("should update the heading", async () => {
    const heading = await page.evaluate(() => {
      window.playComputerTurn();
      return document.querySelector(".js-heading").textContent;
    });
    expect(heading).toMatch(/round/i);
  });

  it("should update the status text", async () => {
    const status = await page.evaluate(() => {
      window.playComputerTurn();
      return document.querySelector(".js-status").textContent;
    });
    expect(status).toMatch(/computer/i);
  });

  it("should add a random color to `computerSequence`", async () => {
    const expected = ["red", "blue", "green", "yellow"];
    const initialComputerSequence = await page.evaluate(() => {
      return window.computerSequence;
    });
    const computerSequence = await page.evaluate(() => {
      window.playComputerTurn();
      return window.computerSequence;
    });
    expect(computerSequence.length).toBe(initialComputerSequence.length + 1);
    expect(expected).toContain(computerSequence[0]);
  });

  it("should call `activatePads()`", async () => {
    const playComputerTurn = await page.evaluate(() => {
      return window.playComputerTurn.toString();
    });
    expect(playComputerTurn).toContain("activatePads");
  });

  it("should call `playHumanTurn()` after the computer's round has finished", async () => {
    await page.evaluate(() => {
      window.playComputerTurn();
    });
    await page.waitForTimeout(1500);
    const status = await page.evaluate(() => {
      return document.querySelector(".js-status").textContent;
    });
    expect(status).toMatch(/player/i);
  });
});
