# WellPlay 

### 당신의 하이라이트를 공유하세요, WellPlay!
### Domain http://front.wellplay.life/ 
<img src="https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/cac415d6-de57-43b9-aac1-dfc3d440ad89" width="100" height="100">
<br>

# 프로젝트 소개

### 목표: 인생의 하이라이트를 공유하는 우리들의 페이스북
자유롭고 간편하게 하이라이트를 공유할 수 있는 커뮤니티의 개발

## 팀원 소개

| <img src="https://avatars.githubusercontent.com/u/43990500?v=4" width="130" height="130"> | <img src="https://avatars.githubusercontent.com/u/90160898?v=4" width="130" height="130"> | <img src="https://avatars.githubusercontent.com/u/81235429?v=4" width="130" height="130"> | <img src="https://avatars.githubusercontent.com/u/134459627?v=4" width="130" height="130"> |
|:-----------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------:|
|                              [김준영](https://github.com/hjklo0220)                               |                             [이진호](https://github.com/bainaryho)                              |                             [황주원](https://github.com/prace-prc)                              |                              [김제균](https://github.com/JekyunKim)                              |


# 핵심 기능
Django & React

### 1️⃣ 로그인과 회원가입
- 로그인 성공 시 JWT 토큰 생성 및 발급
- 회원가입시 이메일 링크를 통해 엔드포인트에서 헤더에 포함된 인증정보로 회원인증
<br><br>![회원가입](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/fc6e7cb6-88c4-445a-92bf-dcad3571c7ca)

### 2️⃣ 프로필 설정 & 게임 계정 연동

- 프로필 이미지 수정, 닉네임 수정 / 회원탈퇴 비밀번호 변경 가능
<br><br>![프로필 편집](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/654bd56b-beb7-4083-8ac5-ecb4d74b2101)
- Riot Api 연동, Nexon Develpoer Api 연동
- Celery 비동기 메세지 큐를 사용하여 백그라운드에서 연동 진행
- Redis를 메세지 브로커로 사용
<br><br>![게임 계정 연동](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/23d0e8cf-4489-4b31-8ad8-d7ecff505bf7)



### 3️⃣ 다른 유저 프로필 보기

- 프로필 이미지 클릭을 통해 다른 유저 프로필 이동
- 팔로우 / 언팔로우
- 프로필 페이지에서 다른 유저 글과 인증 Card를 보고 커뮤니케이션 확장 가능
<br><br>![다른 유저 프로필 보기](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/545f4c89-9d52-4f54-a44f-2c00bd0c6c7d)


### 4️⃣ 게시물에 댓글 달기

- 다른 유저가 작성한 게시물에 댓글 달기
- 댓글 수정 삭제 가능, 최신순 조회
<br><br>![댓글 달기](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/1cda161a-e645-472d-9c51-f6279cc39d60)


### 5️⃣ 게시물 작성

- 게시물 작성 (동영상 업로드, 이미지 업로드),조회,수정,삭제
- 댓글 작성,조회,삭제
- 게시물 좋아요
- 최신순/추천순 조회
<br><br>![글작성](https://github.com/likelion-backend-6th/WellPlay_app/assets/134459627/6a00aea7-7b5e-4796-aeb5-d9dceeac85bb)


# 3.사용기술

### Back-end
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white)](https://redis.io/)
[![Celery](https://img.shields.io/badge/Celery-9D1620?style=for-the-badge&logo=Celery&logoColor=white)](https://docs.celeryproject.org/en/stable/)
[![JSON Web Tokens](https://img.shields.io/badge/JSON%20Web%20Tokens-000000?style=for-the-badge&logo=JSON%20Web%20Tokens&logoColor=white)](https://jwt.io/)

### Front-end
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white)](https://reactjs.org/)
[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=CSS3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white)](https://getbootstrap.com/)

### Dev-Ops
[![GitHub Actions](https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Kubernetes](https://img.shields.io/badge/kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Helm](https://img.shields.io/badge/helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)](https://helm.sh/)
[![Argo](https://img.shields.io/badge/argo-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)](https://argoproj.github.io/)

### Managements
[![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=Discord&logoColor=white)

### Monitoring
[![Grafana](https://img.shields.io/badge/grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)
[![Prometheus](https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
![image](https://github.com/likelion-backend-6th/WellPlay_app/assets/90160898/fb45b245-cd87-4d0c-9731-1608f6ae9d09)


### 서비스 아키텍처 & ERD
![KakaoTalk_20231023_164436533](https://github.com/likelion-backend-6th/WellPlay_app/assets/90160898/60db56aa-a1d6-4c89-9dd8-f19b5c101523)
<br>
![KakaoTalk_20231023_164505907](https://github.com/likelion-backend-6th/WellPlay_app/assets/90160898/f304ab98-1fb2-4695-8bed-b883813cccc3)
