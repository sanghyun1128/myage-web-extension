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

  if (calcButton && datePicker) {
    calcButton.onclick = () => {
      const targetDate = datePicker.value;
      showResult(targetDate, birth, exam, army, fast);
    };
  }

  if (birthPicker && datePicker) {
    chrome.storage.sync.get('birth', (data) => {
      birthPicker.value = data.birth;
      birth = data.birth;

      if (data.birth === '') {
        setDefault('설정을 완료해주세요.');
      }
    });

    birthPicker.onchange = (event) => {
      chrome.storage.sync.set({ birth: event.target.value });
      birth = event.target.value;
      setDefault('날짜를 선택해주세요.');
      datePicker.value = '';
    };
  }

  if (examInput) {
    chrome.storage.sync.get('exam', (data) => {
      examInput.value = data.exam;
      exam = data.exam;
    });

    examInput.onchange = (event) => {
      chrome.storage.sync.set({ exam: event.target.value });
      exam = event.target.value;
    };
  }

  if (armyPicker) {
    chrome.storage.sync.get('army', (data) => {
      armyPicker.value = data.army;
      army = data.army;
    });

    armyPicker.onchange = (event) => {
      chrome.storage.sync.set({ army: event.target.value });
      army = event.target.value;
    };
  }

  if (fastCheckBox) {
    chrome.storage.sync.get('fast', (data) => {
      fastCheckBox.checked = data.fast;
      fast = data.fast;
    });

    fastCheckBox.onchange = (event) => {
      chrome.storage.sync.set({ fast: event.target.checked });
      fast = event.target.checked;
    };
  }

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      if (changes.birth) {
        birthPicker.value = changes.birth.newValue;
        birth = changes.birth.newValue;
      }

      if (changes.exam) {
        examInput.value = changes.exam.newValue;
        exam = changes.exam.newValue;
      }

      if (changes.army) {
        armyPicker.value = changes.army.newValue;
        army = changes.army.newValue;
      }

      if (changes.fast) {
        fastCheckBox.checked = changes.fast.newValue;
        fast = changes.fast.newValue;
      }
    }
  });
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
  exam = Number(exam);

  const resultLabel1 = document.getElementById('resultLabel1');
  const resultLabel2 = document.getElementById('resultLabel2');
  const resultLabel3 = document.getElementById('resultLabel3');

  const newAge = moment(targetDate).diff(moment(birth), 'years');
  const koreanAge = targetDate.split('-')[0] - birth.split('-')[0] + 1;

  const haveToGoArmy = army === '' ? false : true;
  const isBeforeArmy = moment(targetDate).isBefore(army);
  const isInArmy = moment(targetDate).isBetween(army, moment(army).add(21, 'months'));

  const whichSchool = (age) => {
    if (fast) age += 1;
    const durationOfUniv = haveToGoArmy ? 6 : 4;

    if (age < 8) {
      return '어린이';
    } else if (age < 14) {
      const grade = age - 7;
      return `초등학교 ${grade}학년`;
    } else if (age < 17) {
      const grade = age - 13;
      return `중학교 ${grade}학년`;
    } else if (age < 20) {
      const grade = age - 16;
      return `고등학교 ${grade}학년`;
    } else if (age < 20 + exam) {
      return `재수생 ${age - 19}년차`;
    } else if (age < 20 + exam + durationOfUniv) {
      if (isBeforeArmy || !haveToGoArmy) {
        return `대학교 ${age - 19 - exam}학년`;
      } else {
        return `대학교 ${age - 19 - exam - 2}학년`;
      }
    } else {
      return `사회인 ${age - 19 - exam - durationOfUniv}년차`;
    }
  };

  const armyInfo = (armyDate, targetDate) => {
    const duration = moment(targetDate).diff(moment(armyDate), 'months');
    return `군대 ${duration}달 차`;
  };

  resultLabel1.innerText = `당신은 ${targetDate}에`;
  resultLabel2.innerText = `만 ${newAge}세, 한국 나이로 ${koreanAge}세 이고`;

  if (army !== '' && isInArmy) {
    resultLabel3.innerText = `${armyInfo(army, targetDate)} 입니다.`;
  } else {
    resultLabel3.innerText = `${whichSchool(koreanAge)} 인 해 입니다.`;
  }
};

const setDefault = (message) => {
  const resultLabel1 = document.getElementById('resultLabel1');
  const resultLabel2 = document.getElementById('resultLabel2');
  const resultLabel3 = document.getElementById('resultLabel3');

  resultLabel1.innerText = '';
  resultLabel2.innerText = message;
  resultLabel3.innerText = '';
};
