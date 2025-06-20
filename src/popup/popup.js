import moment from 'moment';

// Initialize the popup when the window loads
window.onload = () => {
  showMain();

  // Get DOM elements
  const settingButton = document.getElementById('settingButton');
  const backButton = document.getElementById('backButton');

  const targetDatePicker = document.getElementById('targetDatePicker');
  const calcButton = document.getElementById('calcButton');

  const birthPicker = document.getElementById('birthPicker');
  const examInput = document.getElementById('examInput');
  const armyPicker = document.getElementById('armyPicker');
  const fastCheckBox = document.getElementById('fastCheckBox');

  // Initialize user data variables
  let birth = '';
  let exam = '0';
  let army = '';
  let fast = false;
  let isDataLoaded = false;
  let isUpdatingFromStorage = false;

  // Load user data from Chrome storage
  chrome.storage.sync.get(['birth', 'exam', 'army', 'fast'], (data) => {
    birth = data.birth || '';
    exam = data.exam || '0';
    army = data.army || '';
    fast = data.fast || false;

    // Update form elements with stored data
    if (birthPicker) birthPicker.value = birth;
    if (examInput) examInput.value = exam;
    if (armyPicker) armyPicker.value = army;
    if (fastCheckBox) fastCheckBox.checked = fast;

    isDataLoaded = true;

    // Set default message based on birth data
    if (birth === '') {
      setDefault('설정을 완료해주세요.');
    } else {
      setDefault('');
    }
  });

  // Set up setting button click handler
  if (settingButton) {
    settingButton.onclick = showSetting;
  }

  // Set up back button click handler
  if (backButton) {
    backButton.onclick = showMain;
  }

  // Set up calculate button click handler
  if (calcButton && targetDatePicker) {
    calcButton.onclick = () => {
      const targetDate = targetDatePicker.value;

      // Check if data is loaded
      if (!isDataLoaded) {
        setDefault('데이터를 불러오는 중입니다...');
        return;
      }

      // Validate required data
      if (birth === '') {
        setDefault('설정을 완료해주세요.');
      } else if (targetDate === '') {
        setDefault('날짜를 선택해주세요.');
      } else {
        showResult(targetDate, birth, exam, army, fast);
      }
    };
  }

  // Set up birth date picker change handler
  if (birthPicker && targetDatePicker) {
    birthPicker.onchange = (event) => {
      if (isUpdatingFromStorage) return;

      // Save birth date to storage and update local variable
      chrome.storage.sync.set({ birth: event.target.value });
      birth = event.target.value;
      setDefault('');
      targetDatePicker.value = '';
    };
  }

  // Set up exam years input change handler
  if (examInput) {
    examInput.onchange = (event) => {
      if (isUpdatingFromStorage) return;

      // Save exam years to storage and update local variable
      chrome.storage.sync.set({ exam: event.target.value });
      exam = event.target.value;
    };
  }

  // Set up army service date picker change handler
  if (armyPicker) {
    armyPicker.onchange = (event) => {
      if (isUpdatingFromStorage) return;

      // Save army service date to storage and update local variable
      chrome.storage.sync.set({ army: event.target.value });
      army = event.target.value;
    };
  }

  // Set up fast track checkbox change handler
  if (fastCheckBox) {
    fastCheckBox.onchange = (event) => {
      if (isUpdatingFromStorage) return;

      // Save fast track option to storage and update local variable
      chrome.storage.sync.set({ fast: event.target.checked });
      fast = event.target.checked;
    };
  }

  // Listen for storage changes to sync across tabs/windows
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      isUpdatingFromStorage = true;

      // Update form elements when storage changes
      if (changes.birth && birthPicker) {
        birthPicker.value = changes.birth.newValue;
        birth = changes.birth.newValue;
      }

      if (changes.exam && examInput) {
        examInput.value = changes.exam.newValue;
        exam = changes.exam.newValue;
      }

      if (changes.army && armyPicker) {
        armyPicker.value = changes.army.newValue;
        army = changes.army.newValue;
      }

      if (changes.fast && fastCheckBox) {
        fastCheckBox.checked = changes.fast.newValue;
        fast = changes.fast.newValue;
      }

      // Reset the updating flag after next tick
      setTimeout(() => {
        isUpdatingFromStorage = false;
      }, 0);
    }
  });
};

// Show the settings page
const showSetting = () => {
  const mainDiv = document.getElementById('main');
  const settingDiv = document.getElementById('setting');

  mainDiv.style.display = 'none';
  settingDiv.style.display = 'grid';
};

// Show the main page
const showMain = () => {
  const mainDiv = document.getElementById('main');
  const settingsDiv = document.getElementById('setting');

  mainDiv.style.display = 'grid';
  settingsDiv.style.display = 'none';
};

// Calculate and display the result based on target date and user data
const showResult = (targetDate, birth, exam, army, fast) => {
  exam = Number(exam);

  // Get result display elements
  const resultLabel1 = document.getElementById('resultLabel1');
  const resultLabel2 = document.getElementById('resultLabel2');
  const resultLabel3 = document.getElementById('resultLabel3');

  // Calculate ages
  const newAge = moment(targetDate).diff(moment(birth), 'years');
  const koreanAge = targetDate.split('-')[0] - birth.split('-')[0] + 1;

  // Determine army service status
  const haveToGoArmy = army === '' ? false : true;
  const isBeforeArmy = moment(targetDate).isBefore(army);
  const isInArmy = moment(targetDate).isBetween(army, moment(army).add(21, 'months'));

  // Determine school level or life stage based on Korean age
  const whichSchool = (age) => {
    if (fast) age += 1; // Adjust for fast track
    const durationOfUniv = haveToGoArmy ? 6 : 4; // University duration based on military service

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

  // Calculate military service duration
  const armyInfo = (armyDate, targetDate) => {
    const duration = moment(targetDate).diff(moment(armyDate), 'months');
    return `군대 ${duration}달 차`;
  };

  // Display the results
  resultLabel1.innerText = `당신은 ${targetDate}에`;
  resultLabel2.innerText = `만 ${newAge}세, 한국 나이로 ${koreanAge}세 이고`;

  // Show army status or school level
  if (army !== '' && isInArmy) {
    resultLabel3.innerText = `${armyInfo(army, targetDate)} 입니다.`;
  } else {
    resultLabel3.innerText = `${whichSchool(koreanAge)} 인 해 입니다.`;
  }
};

// Set default message in result labels
const setDefault = (message) => {
  const resultLabel1 = document.getElementById('resultLabel1');
  const resultLabel2 = document.getElementById('resultLabel2');
  const resultLabel3 = document.getElementById('resultLabel3');

  resultLabel1.innerText = '';
  resultLabel2.innerText = message;
  resultLabel3.innerText = '';
};
