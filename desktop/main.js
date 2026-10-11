const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;

async function startLocalServer() {
  try {
    const serverModule = await import('./server-dist/index.js');
    const expressApp = serverModule.default;

    const clientDistPath = path.join(__dirname, 'client-dist');
    expressApp.use(express.static(clientDistPath));

    expressApp.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });

    const PORT = 3001;
    await new Promise((resolve) => {
      expressApp.listen(PORT, '127.0.0.1', () => {
        console.log(`[Desktop] Server listening on http://127.0.0.1:${PORT}`);
        resolve();
      });
    });
  } catch (err) {
    console.error('Failed to initialize local desktop backend:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 850,
    minHeight: 650,
    title: 'Universal Safelink Bypasser',
    backgroundColor: '#090d16',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://127.0.0.1:3001');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
