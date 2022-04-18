jest.setTimeout(30000);
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
}

describe("US-01: Basic Game Structure", () => {
  beforeEach(setUpTest);

  it.only("has a heading e.g. <h1 id='title'>Simon Says</h1>", async () => {
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
      return [window.statusSpan, window.heading, window.padContainer]
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
    pads.forEach((pad) => expect(Object.keys(pad)).toEqual(expect.arrayContaining(["color", "selector", "sound"])));
  });
});

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
    await page.waitFor(1500);
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
    await page.waitFor(1500);
    const status = await page.evaluate(() => {
      return document.querySelector(".js-status").textContent;
    });
    expect(status).toMatch(/player/i);
  });
});

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

describe("US-04: checkPress()", () => {
  beforeEach(setUpTest);
  
  it("should add a color to playerSequence", async () => {
    const playerSequence = await page.evaluate(() => {
      window.checkPress("blue");
      return window.playerSequence;
    });
    expect(playerSequence).toContain("blue");
  });
});

describe("US-04: checkRound()", () => {
  beforeEach(setUpTest);
  
  it("should keep the game going when the player has not completed all rounds of a level", async () => {
    const initialRoundCount = await page.evaluate(() => {
      return window.roundCount;
    });
    const [roundCount, playerSequence, status] = await page.evaluate(() => {
      window.checkRound();
      return [
        window.roundCount,
        window.playerSequence,
        document.querySelector(".js-status").textContent,
      ];
    });
    expect(roundCount).toBe(initialRoundCount + 1);
    expect(playerSequence.length).toBe(0);
    expect(status).toEqual(/keep going/);
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
  
  it("should select the correct color", async () => {
    const color = await page.evaluate(() => {
      return window
        .padHandler({ target: { dataset: { color: "red" } } });
    });
    expect(color).toBe("red");
  });

  it("should call `sound.play()`", async () => {
    const padHandler = await page.evaluate(() => {
      return window
        .padHandler
        .toString();
    });
    expect(padHandler).toContain("sound.play()");
  });

  it("should call `checkPress(color)`", async () => {
    const padHandler = await page.evaluate(() => {
      return window
        .padHandler
        .toString();
    });
    expect(padHandler).toContain("checkPress(color)");
  });
});

describe("US-05: resetGame(text)", () => {
  beforeEach(setUpTest);
  
  it("should reset the game variables", async () => {
    const [computerSequence, playerSequence, roundCount] = await page.evaluate(
      () => {
        window.resetGame("some text");
        return [
          window.computerSequence,
          window.playerSequence,
          window.roundCount,
        ];
      }
    );
    expect(computerSequence).toEqual([]);
    expect(playerSequence).toEqual([]);
    expect(roundCount).toEqual(0);
  });

  it("should call `alert(text)`", async () => {
    const resetGameToString = await page.evaluate(() => {
      return window.resetGame.toString();
    });
    expect(resetGameToString).toContain("alert(text)");
  });

  it("should reset the heading to `Simon Says`", async () => {
    const headingText = await page.evaluate(() => {
      window.resetGame("some text");
      return document.querySelector(".js-heading").textContent;
    });
    expect(headingText).toBe("Simon Says");
  });

  it("should show the start button", async () => {
    const classList = await page.evaluate(() => {
      window.resetGame("some text");
      return document.querySelector(".js-start-button").classList;
    });
    expect(Object.values(classList)).not.toContain("hidden");
  });

  it("should hide the status message", async () => {
    const classList = await page.evaluate(() => {
      window.resetGame("some text");
      return document.querySelector(".js-status").classList;
    });
    expect(Object.values(classList)).toContain("hidden");
  });

  it("should reset the pad container", async () => {
    const classList = await page.evaluate(() => {
      window.resetGame("some text");
      return document.querySelector(".js-pad-container").classList;
    });
    expect(Object.values(classList)).toContain("unclickable");
  });
});
