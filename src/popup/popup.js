window.onload = () => {
  showMain();
  const settingButton = document.getElementById('settingButton');
  const backButton = document.getElementById('backButton');
  
  if (settingButton) {
    settingButton.onclick = showSetting;
  }

  if (backButton) {
    backButton.onclick = showMain;
  }
}

const showSetting = () => {
  const mainDiv = document.getElementById('main');
  const settingDiv = document.getElementById('setting');

  mainDiv.style.display = 'none';
  settingDiv.style.display = 'grid';
}

const showMain = () => {
  const mainDiv = document.getElementById('main');
  const settingsDiv = document.getElementById('setting');

  mainDiv.style.display = 'grid';
  settingsDiv.style.display = 'none';
}