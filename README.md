<div align=center>
  
# 나이 계산기

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />

<img src="https://img.shields.io/badge/WEBPACK-1572B6?style=for-the-badge&logo=webpack&logoColor=white" />
<img src="https://img.shields.io/badge/prettier-1572B6?style=for-the-badge&logo=prettier&logoColor=white" />

</div>

사용자의 생일과 원하는 날짜를 입력하면 만 나이와 한국 나이를 계산해주는 Chrome 확장 프로그램입니다.

<div align=center>
  <a href="https://chromewebstore.google.com/detail/%EB%82%98%EC%9D%B4-%EA%B3%84%EC%82%B0%EA%B8%B0/ddnmiejlpkabjlbbakmlgljdinniedmm?authuser=0&hl=ko" target="_blank">
    <img src="https://img.shields.io/badge/Download-D14836?style=for-the-badge&logoColor=white" />
  </a>
</div>

## 특징

- 사용자가 설정한 생일과 입력한 날짜를 기반으로 만 나이와 한국 나이를 계산
- 사용자가 재수 기간과 입영일을 설정할 수 있음
- 빠른 년생 여부 설정으로 계산 방식에 영향을 줌
- Chrome의 storage API를 사용하여 사용자 설정을 저장

## 파일 개요

- **[manifest.json](manifest.json):** 확장 프로그램의 기본 설정 및 아이콘, 백그라운드 스크립트를 지정합니다.
- **[src/popup/popup.html](src/popup/popup.html):** 팝업의 사용자 인터페이스를 정의합니다.
- **[src/popup/popup.js](src/popup/popup.js):** 나이 계산 로직 및 사용자 이벤트 핸들러 구현.
- **[src/background.js](src/background.js):** 확장 프로그램 설치 시 초기 사용자 설정을 Chrome storage에 등록합니다.
- **[webpack.config.js](webpack.config.js):** [Webpack](https://webpack.js.org/) 설정 파일로, 팝업 스크립트를 번들링합니다.
- **[package.json](package.json):** 프로젝트 스크립트, 의존성 등이 정의되어 있습니다.
- **[src/popup/popup.css](src/popup/popup.css):** 팝업 사용자 인터페이스 스타일 시트.

## 설치 및 빌드

1. 의존성을 설치하려면 아래 명령어를 실행합니다:

   ```sh
   yarn
   ```

2. 확장 프로그램을 빌드하려면 아래 명령어를 실행합니다:

   ```sh
   yarn build
   ```

   빌드 결과물은 dist 폴더에 생성됩니다.

3. 개발 모드에서 파일이 변경될 때마다 자동으로 번들링하려면:

   ```sh
   yarn watch
   ```

4. 릴리즈 파일을 생성하려면:

   ```sh
   yarn zip
   ```

   생성된 릴리즈 파일은 [versions](versions) 폴더에서 확인할 수 있습니다.

## 사용법

1.  브라우저 툴바에서 확장 프로그램 아이콘을 클릭하여 팝업 창을 엽니다. (단축키 등록 추천)

2.  팝업 내에서 생일과 기타 설정 값을 입력한 후, 원하는 날짜를 선택하여 계산 버튼을 누르면 만 나이와 한국 나이, 그리고 학교/군대 관련 정보를 확인할 수 있습니다.
