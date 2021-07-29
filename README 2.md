# ✏️배민 문방구 클론코딩 - Backend

배민 문방구 클론코딩을 하여 **회원가입,로그인, 상품 조회 및 검색, 구매, 후기 작성**을 구현하였습니다. 
<img width="1792" alt="스크린샷 2021-06-01 오후 1 52 22" src="https://user-images.githubusercontent.com/61581033/120269605-12943680-c2e3-11eb-878e-740c743f159d.png"><img width="1792" alt="스크린샷 2021-06-01 오후 2 06 41" src="https://user-images.githubusercontent.com/61581033/120269694-4707f280-c2e3-11eb-9592-cffde07089cf.png">
<hr>

## 🔗Link 
  http://baemin-store.s3-website.ap-northeast-2.amazonaws.com/

## 🎥Video
  https://www.youtube.com/watch?v=fK8xaKxO3-Q
    
## 📌 프로젝트 기간 및 팀원 소개
- 기간 : 2021.04.09 ~ 2021.04.22

- 팀원 (프론트 3명 / 백엔드 1명(중도 하차 1명)
  - **FRONTEND**
    
    ![](https://img.shields.io/badge/React-김율아-blue?style=for-the-badge)
    
    ![](https://img.shields.io/badge/React-이명섭-blue?style=for-the-badge)
    
    ![](https://img.shields.io/badge/React-길근용-blue?style=for-the-badge)
    
  - **BACKEND** 

     ![](https://img.shields.io/badge/Node.js-유지윤-pink?style=for-the-badge)
     
<hr>

## ⚒️개발 스펙
**🌱Node.js🌱**<br>

개발 언어 : **Javascript**

데이터베이스 : **MongoDB**

배포 : **AWS**

라이브러리 : **express, jsonwebtoken, nodemon, mongoose, dotenv, cors** 

## ✨프로젝트 중 고민한 부분✨
### 1. dotenv를 활용한 환경변수 관리
이전에 환경 변수들을 따로 관리하지 않아서 그대로 github와 같은 버전 관리 시스템에 public하게 올라가는 문제가 있었습니다.
그래서 이번 프로젝트에서는 처음부터 **.env** 파일을 만들고 gitignore를 만들어서 보안적 문제를 해결하였습니다.

### 2. 상품 후기 관련
상품 후기는 상품을 구매한 사람이며, 이전에 상품 후기를 작성하지 않은 사람이어야 한다. 그래서 이부분을
상품 후기 작성 여부와 구매 여부를 **Promise.all(속도개선)** 을 통해서 찾은 뒤에, 조건을 걸어 처리해주었습니다.

```jsx
const [commentCheck, buyCheck] = await Promise.all([
      Comment.findOne().and([{ user: userId }, { goods: goodsId }]),
      Order.findOne().and([{ user: userId }, { goods: goodsId }]),
    ]);
    //후기 작성 여부
    if (commentCheck)
      return res
        .status(401)
        .send({ err: "이미 해당 상품의 후기를 작성하셨습니다." });
    //해당 상품 구매여부
    if (!buyCheck)
      return res
        .status(401)
        .send({ err: "구매한 상품에 대해서만 후기 작성 가능합니다." });
```

## 😎성장한 점
- Postman 사용으로 Front와의 원만한 소통
- gitbranch 적극적인 사용
- 두 번의 실제 서비스 클론 코딩 경험으로, 실제 운영 서비스의 흐름을 잘 이해하게 됨
