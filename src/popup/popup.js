import moment from 'moment';

/**
 * DOM Elements
 */
const getDOMElements = () => ({
  // Navigation elements
  settingButton: document.getElementById('settingButton'),
  backButton: document.getElementById('backButton'),

  // Main page elements
  targetDatePicker: document.getElementById('targetDatePicker'),
  calcButton: document.getElementById('calcButton'),

  // Settings page elements
  birthPicker: document.getElementById('birthPicker'),
  examInput: document.getElementById('examInput'),
  armyPicker: document.getElementById('armyPicker'),
  fastCheckBox: document.getElementById('fastCheckBox'),

  // Result elements
  resultLabel1: document.getElementById('resultLabel1'),
  resultLabel2: document.getElementById('resultLabel2'),
  resultLabel3: document.getElementById('resultLabel3'),

  // Layout elements
  mainDiv: document.getElementById('main'),
  settingDiv: document.getElementById('setting'),
});

/**
 * Application State
 */
const createAppState = () => ({
  birth: '',
  exam: '0',
  army: '',
  fast: false,
  isDataLoaded: false,
  isUpdatingFromStorage: false,
});

/**
 * Initialize the popup when the window loads
 */
window.onload = () => {
  const elements = getDOMElements();
  const state = createAppState();

  showMain();
  loadUserData(state, elements);
  setupEventHandlers(state, elements);
};

/**
 * Load user data from Chrome storage
 */
const loadUserData = (state, elements) => {
  chrome.storage.sync.get(['birth', 'exam', 'army', 'fast'], (data) => {
    // Update state
    state.birth = data.birth || '';
    state.exam = data.exam || '0';
    state.army = data.army || '';
    state.fast = data.fast || false;

    // Update form elements with stored data
    updateFormElements(state, elements);

    state.isDataLoaded = true;

    // Set default message based on birth data
    if (state.birth === '') {
      setDefault('설정을 완료해주세요.');
    } else {
      setDefault('');
    }
  });
};

/**
 * Update form elements with current state
 */
const updateFormElements = (state, elements) => {
  if (elements.birthPicker) elements.birthPicker.value = state.birth;
  if (elements.examInput) elements.examInput.value = state.exam;
  if (elements.armyPicker) elements.armyPicker.value = state.army;
  if (elements.fastCheckBox) elements.fastCheckBox.checked = state.fast;
};

/**
 * Setup all event handlers
 */
const setupEventHandlers = (state, elements) => {
  setupNavigationHandlers(elements);
  setupCalculationHandler(state, elements);
  setupFormHandlers(state, elements);
  setupStorageChangeListener(state, elements);
};

/**
 * Setup navigation event handlers
 */
const setupNavigationHandlers = (elements) => {
  if (elements.settingButton) {
    elements.settingButton.onclick = showSetting;
  }

  if (elements.backButton) {
    elements.backButton.onclick = showMain;
  }
};

/**
 * Setup calculation button handler
 */
const setupCalculationHandler = (state, elements) => {
  if (elements.calcButton && elements.targetDatePicker) {
    elements.calcButton.onclick = () => {
      const targetDate = elements.targetDatePicker.value;

      // Check if data is loaded
      if (!state.isDataLoaded) {
        setDefault('데이터를 불러오는 중입니다...');
        return;
      }

      // Validate required data
      if (state.birth === '') {
        setDefault('설정을 완료해주세요.');
      } else if (targetDate === '') {
        setDefault('날짜를 선택해주세요.');
      } else {
        showResult(targetDate, state);
      }
    };
  }
};

/**
 * Setup form change handlers
 */
const setupFormHandlers = (state, elements) => {
  const createOnChangeHandler = (storageKey, updateStateValue, additionalCallback) => {
    return (event) => {
      if (state.isUpdatingFromStorage) return;

      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

      // Save to storage and update state
      chrome.storage.sync.set({ [storageKey]: value });
      updateStateValue(value);

      // Execute additional callback if provided
      if (additionalCallback) {
        additionalCallback();
      }
    };
  };

  // Birth date picker
  if (elements.birthPicker && elements.targetDatePicker) {
    elements.birthPicker.onchange = createOnChangeHandler(
      'birth',
      (value) => {
        state.birth = value;
      },
      () => {
        setDefault('');
        elements.targetDatePicker.value = '';
      },
    );
  }

  // Exam years input
  if (elements.examInput) {
    elements.examInput.onchange = createOnChangeHandler('exam', (value) => {
      state.exam = value;
    });
  }

  // Army service date picker
  if (elements.armyPicker) {
    elements.armyPicker.onchange = createOnChangeHandler('army', (value) => {
      state.army = value;
    });
  }

  // Fast track checkbox
  if (elements.fastCheckBox) {
    elements.fastCheckBox.onchange = createOnChangeHandler('fast', (value) => {
      state.fast = value;
    });
  }
};

/**
 * Setup storage change listener for syncing across tabs/windows
 */
const setupStorageChangeListener = (state, elements) => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      state.isUpdatingFromStorage = true;

      // Update form elements when storage changes
      if (changes.birth && elements.birthPicker) {
        elements.birthPicker.value = changes.birth.newValue;
        state.birth = changes.birth.newValue;
      }

      if (changes.exam && elements.examInput) {
        elements.examInput.value = changes.exam.newValue;
        state.exam = changes.exam.newValue;
      }

      if (changes.army && elements.armyPicker) {
        elements.armyPicker.value = changes.army.newValue;
        state.army = changes.army.newValue;
      }

      if (changes.fast && elements.fastCheckBox) {
        elements.fastCheckBox.checked = changes.fast.newValue;
        state.fast = changes.fast.newValue;
      }

      // Reset the updating flag after next tick
      setTimeout(() => {
        state.isUpdatingFromStorage = false;
      }, 0);
    }
  });
};

/**
 * Page Navigation Functions
 */

/**
 * Show the main page
 */
const showMain = () => {
  const elements = getDOMElements();
  elements.mainDiv.style.display = 'grid';
  elements.settingDiv.style.display = 'none';
};

/**
 * Show the settings page
 */
const showSetting = () => {
  const elements = getDOMElements();
  elements.mainDiv.style.display = 'none';
  elements.settingDiv.style.display = 'grid';
};

/**
 * Calculation and Display Functions
 */

/**
 * Calculate and display the result based on target date and user data
 */
const showResult = (targetDate, state) => {
  const { birth, exam, army, fast } = state;
  const examYears = Number(exam);

  const elements = getDOMElements();

  // Calculate ages
  const newAge = moment(targetDate).diff(moment(birth), 'years');
  const koreanAge = targetDate.split('-')[0] - birth.split('-')[0] + 1;

  // Determine army service status
  const haveToGoArmy = army !== '';
  const isBeforeArmy = moment(targetDate).isBefore(army);
  const isInArmy = moment(targetDate).isBetween(army, moment(army).add(21, 'months'));

  // Display the results
  elements.resultLabel1.innerText = `당신은 ${targetDate}에`;
  elements.resultLabel2.innerText = `만 ${newAge}세, 한국 나이로 ${koreanAge}세 이고`;

  // Show army status or school level
  if (army !== '' && isInArmy) {
    elements.resultLabel3.innerText = `${getArmyInfo(army, targetDate)} 입니다.`;
  } else {
    elements.resultLabel3.innerText = `${getSchoolLevel(koreanAge, examYears, haveToGoArmy, isBeforeArmy, fast)} 인 해 입니다.`;
  }
};

/**
 * Determine school level or life stage based on Korean age
 */
const getSchoolLevel = (age, examYears, haveToGoArmy, isBeforeArmy, fast) => {
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
  } else if (age < 20 + examYears) {
    return `재수생 ${age - 19}년차`;
  } else if (age < 20 + examYears + durationOfUniv) {
    if (isBeforeArmy || !haveToGoArmy) {
      return `대학교 ${age - 19 - examYears}학년`;
    } else {
      return `대학교 ${age - 19 - examYears - 2}학년`;
    }
  } else {
    return `사회인 ${age - 19 - examYears - durationOfUniv}년차`;
  }
};

/**
 * Calculate military service duration
 */
const getArmyInfo = (armyDate, targetDate) => {
  const duration = moment(targetDate).diff(moment(armyDate), 'months');
  return `군대 ${duration}달 차`;
};

/**
 * Set default message in result labels
 */
const setDefault = (message) => {
  const elements = getDOMElements();
  elements.resultLabel1.innerText = '';
  elements.resultLabel2.innerText = message;
  elements.resultLabel3.innerText = '';
};
