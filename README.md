# Tool install

## Gitmoji

> Window

```
$ npm i -g gitmoji-cli
```

<br>

> Mac OS

```
$ brew install gitmoji
```

# Commit Rule

## gitmoji

📝 (code : `:memo:`) : 파일 및 코드 추가 ex) .gitignore <br>
✅ (code : `:white_check_mark:`) : 프로젝트, 기능 완성한 파일 ex) project1 thread <br>
🐛 (code : `:bug:`) : 버그 발생시 수정한 파일 ex) failed test, else.. <br>
✏️ (code : `:pencil2:`) : 오타 및 주석 추가 및 수정 <br>
🔥 (code : `:fire:`) : 파일 및 코드 삭제

> 여기서 입력한 `origin`은 origin/main 브랜치로 깃허브 상에서 default 브랜치를 가리킨다.
> git push, pull 등 명령어 수행 시 브런치 명 위치 확실히 생각하고 쓸 것.

## commit, push

> 로컬 브랜치 명은 깃허브 아이디로 하고, origin에 푸시한 후 PR한 후 merge를 시도한다.

```
1. git add file.name
        or
   git add .
2. gitmoji -c
    1. vscode 상에서 gitmoji 선택
    2. commit title : add, delete 등 먼저 명확한 의미 작성 ex) add .gitignore
    3. commit message : 상세 내용 ex) .gitignore 불필요한 .vscode 폴더 추가
3. git push origin 내 브랜치 명 ex) git push origin sunghwan95
4. git checkout main 이후 git pull
5. 내 브랜치 삭제 ex) git branch -D sunghwan95
6. 다시 내 브랜치 생성 ex) git branch sunghwan95
7. 내 브랜치로 이동 ex) git checkout sunghwan95
8. 작업 재개
```

## merge

```
push 후 깃헙 페이지에서 PR 후 팀원들과 상의 후 merge하기
```

## pull

```
git pull origin 내 브런치 명 ex) git pull origin sunghwan95
```
