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

describe("US-01: Basic Game Structure", () => {
  beforeEach(setUpTest);

  it("has a heading e.g. <h1 id='title'>Simon Says</h1>", async () => {
    const heading = await page.evaluate(() => {
      const heading = document.querySelectorAll(".js-heading");
      return heading.length;
    });

    expect(heading).not.toBeNull();
    expect(heading).toEqual(1);
  });

  it("has four pads <div class='pad'>", async () => {
    const pads = await page.evaluate(() => {
      const pads = document.querySelectorAll(".pad");
      return pads.length;
    });
    expect(pads).not.toBeNull();
    expect(pads).toEqual(4);
  });

  it("has a red pad <div class='pad-red'>", async () => {
    const pad = await page.evaluate(() => {
      const pad = document.querySelectorAll(".js-pad-red");
      return pad.length;
    });
    expect(pad).not.toBeNull();
    expect(pad).toEqual(1);
  });

  it("has a green pad <div class='pad-green'>", async () => {
    const pad = await page.evaluate(() => {
      const pad = document.querySelectorAll(".js-pad-green");
      return pad.length;
    });
    expect(pad).not.toBeNull();
    expect(pad).toEqual(1);
  });

  it("has a blue pad <div class='pad-blue'>", async () => {
    const pad = await page.evaluate(() => {
      const pad = document.querySelectorAll(".js-pad-blue");
      return pad.length;
    });
    expect(pad).not.toBeNull();
    expect(pad).toEqual(1);
  });

  it("has a yellow pad <div class='pad-yellow'>", async () => {
    const pad = await page.evaluate(() => {
      const pad = document.querySelectorAll(".js-pad-yellow");
      return pad.length;
    });
    expect(pad).not.toBeNull();
    expect(pad).toEqual(1);
  });

  it("has a 'start' button <button class='js-start-button'>Start</button>", async () => {
    const startButton = await page.evaluate(() => {
      const startButton = document.querySelectorAll(".js-start-button");
      return startButton.length;
    });
    expect(startButton).not.toBeNull();
    expect(startButton).toEqual(1);
  });

  it("has a 'status' <span class='js-status'></span>", async () => {
    const status = await page.evaluate(() => {
      const status = document.querySelectorAll(".js-status");
      return status.length;
    });
    expect(status).not.toBeNull();
    expect(status).toEqual(1);
  });

  it("the status, heading, and pad container elements are defined in the script", async () => {
    const [status, heading, padContainer] = await page.evaluate(() => {
      return [window.statusSpan, window.heading, window.padContainer];
    });

    expect(status).toBeDefined();
    expect(heading).toBeDefined();
    expect(padContainer).toBeDefined();
  });

  it("defines JS objects for the green, blue, and yellow pads", async () => {
    const pads = await page.evaluate(() => {
      return window.pads;
    });

    expect(pads).toHaveLength(4);
    pads.forEach((pad) =>
      expect(Object.keys(pad)).toEqual(
        expect.arrayContaining(["color", "selector", "sound"])
      )
    );
  });
});
