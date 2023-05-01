# wm_devtest

- MacOS 환경에서 실행한 것을 토대로 작성한 문서입니다.
- API 테스트는 postman을 통해 진행했습니다.


### 실행방법
1. Docker image pull: 
`docker pull jaeminjeong/wm_devtest`

2. Docker container run:
`docker run -dp 3000:3000 jaeminjeong/wm_devtest`

### API 설명

1. 특정 토큰의 최신 데이터 조회

```
http://localhost:3000/tokens/[토큰symbol]/latest

ex) http://localhost:3000/tokens/btcusd/latest
```

2. 특정 출처 & 특정 토큰의 최신 데이터 조회

```
http://localhost:3000/tokens/[토큰symbol]/latest?source=[가격출처]

ex) http://localhost:3000/tokens/btcusd/latest?source=chainlink
```

3. 지정한 기간 내 특정 토큰의 평균 가격 조회

```
http://localhost:3000/tokens/[토큰symbol]/midPirce?startTime=[시작일]&endTime=[종료일]

ex) http://localhost:3000/tokens/usdtusd/midPirce?startTime=2023-04-28&endTime=2023-04-30
```


---

### 30초마다 실행되는 스케줄러 작성

- Bitfinex API를 통해 토큰 정보 조회&DB 저장하는 API 호출하는 스크립트: bitfinex_schedular.sh
- Chainlink 컨트랙트에서 토큰 정보 조회&DB 저장하는 API 호출하는 스크립트: chainlink_schedular.sh

1. crontab -e

2. 아래 내용 입력 후 저장

```
* * * * * sh [스크립트 파일이 있는 경로]/chainlink_schedular.sh >> [실행 로그를 저장할 경로]/schedular.log 2>&1
* * * * * sleep 30; sh [스크립트 파일이 있는 경로]/chainlink_schedular.sh >> [실행 로그를 저장할 경로]/schedular.log 2>&1
* * * * * sh [스크립트 파일이 있는 경로]/bitfinex_schedular.sh >> [실행 로그를 저장할 경로]/schedular.log 2>&1
* * * * * sleep 30; sh [스크립트 파일이 있는 경로]/bitfinex_schedular.sh >> [실행 로그를 저장할 경로]/schedular.log 2>&1
```

### 스케줄러 실행 결과

<img width="670" alt="스크린샷 2023-05-01 오후 10 16 27" src="https://user-images.githubusercontent.com/43660250/235456813-a38031c7-fe9a-4bf0-97ab-ad9d986732b0.png">



