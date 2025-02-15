import moment from 'moment';

window.onload = () => {
  showMain();

  const settingButton = document.getElementById('settingButton');
  const backButton = document.getElementById('backButton');

  const datePicker = document.getElementById('datePicker');
  const calcButton = document.getElementById('calcButton');

  const birthPicker = document.getElementById('birthPicker');
  const examInput = document.getElementById('examInput');
  const armyPicker = document.getElementById('armyPicker');
  const fastCheckBox = document.getElementById('fastCheckBox');

  let birth = '';
  let exam = 0;
  let army = '';
  let fast = false;

  if (settingButton) {
    settingButton.onclick = showSetting;
  }

  if (backButton) {
    backButton.onclick = showMain;
  }

  if (calcButton) {
    calcButton.onclick = () => {
      const targetDate = datePicker.value;
      showResult(targetDate, birth, exam, army, fast);
    };
  }

  if (birthPicker) {
    chrome.storage.sync.get('birth', (data) => {
      birthPicker.value = data.birth;
      birth = data.birth;
    });

    birthPicker.onchange = (event) => {
      const birth = event.target.value;
      chrome.storage.sync.set({ birth });
    };
  }

  if (examInput) {
    chrome.storage.sync.get('exam', (data) => {
      examInput.value = data.exam;
      exam = data.exam;
    });

    examInput.onchange = (event) => {
      const exam = event.target.value;
      chrome.storage.sync.set({ exam });
    };
  }

  if (armyPicker) {
    chrome.storage.sync.get('army', (data) => {
      armyPicker.value = data.army;
      army = data.army;
    });

    armyPicker.onchange = (event) => {
      const army = event.target.value;
      chrome.storage.sync.set({ army });
    };
  }

  if (fastCheckBox) {
    chrome.storage.sync.get('fast', (data) => {
      fastCheckBox.checked = data.fast;
      fast = data.fast;
    });

    fastCheckBox.onchange = (event) => {
      const fast = event.target.checked;
      chrome.storage.sync.set({ fast });
    };
  }
};

const showSetting = () => {
  const mainDiv = document.getElementById('main');
  const settingDiv = document.getElementById('setting');

  mainDiv.style.display = 'none';
  settingDiv.style.display = 'grid';
};

const showMain = () => {
  const mainDiv = document.getElementById('main');
  const settingsDiv = document.getElementById('setting');

  mainDiv.style.display = 'grid';
  settingsDiv.style.display = 'none';
};

const showResult = (targetDate, birth, exam, army, fast) => {
  const resultLabel1 = document.getElementById('resultLabel1');
  const resultLabel2 = document.getElementById('resultLabel2');
  const resultLabel3 = document.getElementById('resultLabel3');

  const newAge = moment(targetDate).diff(moment(birth), 'years');
  const koreanAge = targetDate.split('-')[0] - birth.split('-')[0] + 1;

  const school = (age) => {
    if (fast) age += 1;

    if (age < 8) {
      return '유치원';
    } else if (age < 14) {
      const grade = age - 7;
      return `초등학교 ${grade}학년`;
    } else if (age < 17) {
      const grade = age - 13;
      return `중학교 ${grade}학년`;
    } else if (age < 20) {
      const grade = age - 16;
      return `고등학교 ${grade}학년`;
    } else if (age < 27) {
      return '대학생';
    } else {
      return '직장인';
    }
  };

  resultLabel1.innerText = `당신은 ${targetDate}에`;
  resultLabel2.innerText = `만 ${newAge}세, 한국 나이로 ${koreanAge}세 이고`;
  resultLabel3.innerText = `${school(koreanAge)} 입니다.`;
};
