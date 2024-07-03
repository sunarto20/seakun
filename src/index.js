// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { default: puppeteer } = require("puppeteer");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // webPreferences: {},
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");

  ipcMain.on("start", (event, args) => {
    tiktokPage(args);
    event.sender.send("on start", "Application Running");
  });
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const tiktokPage = async (fields) => {
  const loginPage = "https://www.tiktok.com/login/phone-or-email/email";
  const inputForm = ".etcs7ny1";
  const inputFormPassword =
    "#loginContainer > div.tiktok-aa97el-DivLoginContainer.exd0a430 > form > div.tiktok-15iauzg-DivContainer.e1bi0g3c0 > div > input";
  const buttonLogin = ".ehk74z00";

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });
  // Navigate the page to a URL.
  await page.goto(loginPage, { timeout: 0 });
  await page.type(inputForm, fields.email, { delay: 120 });
  await page.type(inputFormPassword, fields.password, { delay: 120 });
  await page.click(buttonLogin);

  await page.waitForNavigation({
    waitUntil: ["load", "networkidle0"],
    timeout: 0,
  });

  let maxScreen = 10;

  for (let index = 1; index <= maxScreen; index++) {
    const likeButton = `#main-content-homepage_hot > div.e108hwin0 > div:nth-child(${index}) > div > div > div.ees02z00 > button:nth-child(2) > span`;
    await page.waitForSelector(likeButton, { timeout: 0 });
    await page.click(likeButton);
    await page.keyboard.press("ArrowDown");

    console.log(`Data tiktok ke ${index}`);
  }

  await browser.close();
};
