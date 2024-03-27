import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "models", "sakura-13b-korean-v0.9-Q6_K.gguf"),
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

const PORT = 5000;

const oftenEmojiList = {
    "start": {
        emoji: "🎉",
        desc: "프로젝트 시작"
    },
    "performance": {
        emoji: "⚡️",
        desc: "성능 개선"
    },
    "delete": {
        emoji: "🔥",
        desc: "코드나 파일 삭제"
    },
    "ui": {
        emoji: "💄",
        desc: "UI 및 스타일 파일 추가 또는 업데이트"
    },
    "feature": {
        emoji: "✨",
        desc: "새로운 기능 추가"
    },
    "bug": {
        emoji: "🐛",
        desc: "버그 수정"
    },
    "documentation": {
        emoji: "📝",
        desc: "문서 추가 또는 업데이트"
    },
    "deploy": {
        emoji: "🚀",
        desc: "배포"
    },
    "work_in_progress": {
        emoji: "🚧",
        desc: "진행 중인 작업"
    },
    "upgrade": {
        emoji: "⬆️",
        desc: "종속성 업그레이드"
    },
    "downgrade": {
        emoji: "⬇️",
        desc: "종속성 다운그레이드"
    },
    "package": {
        emoji: "📦️",
        desc: "컴파일된 파일 또는 패키지 추가 또는 업데이트"
    },
    "lint": {
        emoji: "🚨",
        desc: "컴파일러/린터 경고 수정"
    },
    "refactor": {
        emoji: "♻️",
        desc: "코드 리팩토링"
    },
};

const emojiList = {
    "ambulance": {
        emoji: "🚑️",
        desc: "심각한 버그 수정"
    },
    "check": {
        emoji: "✅",
        desc: "테스트 추가, 업데이트, 또는 통과"
    },
    "lock": {
        emoji: "🔒️",
        desc: "보안 또는 개인 정보 문제 수정"
    },
    "key": {
        emoji: "🔐",
        desc: "비밀 정보 추가 또는 업데이트"
    },
    "bookmark": {
        emoji: "🔖",
        desc: "릴리즈 또는 버전 태그"
    },
    "green_heart": {
        emoji: "💚",
        desc: "CI 빌드 수정"
    },
    "pushpin": {
        emoji: "📌",
        desc: "특정 버전의 종속성 고정"
    },
    "construction_worker": {
        emoji: "👷",
        desc: "CI 빌드 시스템 추가 또는 업데이트"
    },
    "chart_increasing": {
        emoji: "📈",
        desc: "분석 또는 코드 추적 추가 또는 업데이트"
    },
    "heavy_plus_sign": {
        emoji: "➕",
        desc: "종속성 추가"
    },
    "heavy_minus_sign": {
        emoji: "➖",
        desc: "종속성 제거"
    },
    "wrench": {
        emoji: "🔧",
        desc: "설정 파일 추가 또는 업데이트"
    },
    "hammer": {
        emoji: "🔨",
        desc: "개발 스크립트 추가 또는 업데이트"
    },
    "globe_with_meridians": {
        emoji: "🌐",
        desc: "국제화 및 로컬라이제이션"
    },
    "pencil2": {
        emoji: "✏️",
        desc: "오탈자 수정"
    },
    "hankey": {
        emoji: "💩",
        desc: "개선이 필요한 나쁜 코드 작성"
    },
    "rewind": {
        emoji: "⏪️",
        desc: "변경 사항 되돌리기"
    },
    "twisted_rightwards_arrows": {
        emoji: "🔀",
        desc: "브랜치 병합"
    },
    "alien": {
        emoji: "👽️",
        desc: "외부 API 변경으로 인한 코드 업데이트"
    },
    "truck": {
        emoji: "🚚",
        desc: "리소스(예: 파일, 경로, 라우트) 이동 또는 이름 변경"
    },
    "page_facing_up": {
        emoji: "📄",
        desc: "라이선스 추가 또는 업데이트"
    },
    "boom": {
        emoji: "💥",
        desc: "주요 변경 사항 도입"
    },
    "bento": {
        emoji: "🍱",
        desc: "에셋 추가 또는 업데이트"
    },
    "wheelchair": {
        emoji: "♿️",
        desc: "접근성 개선"
    },
    "bulb": {
        emoji: "💡",
        desc: "소스 코드 주석 추가 또는 업데이트"
    },
    "beers": {
        emoji: "🍻",
        desc: "취한 상태로 코드 작성"
    },
    "speech_balloon": {
        emoji: "💬",
        desc: "텍스트 및 리터럴 추가 또는 업데이트"
    },
    "file_cabinet": {
        emoji: "🗃️",
        desc: "데이터베이스 관련 변경"
    },
    "loud_sound": {
        emoji: "🔊",
        desc: "로그 추가 또는 업데이트"
    },
    "mute": {
        emoji: "🔇",
        desc: "로그 삭제"
    },
    "busts_in_silhouette": {
        emoji: "👥",
        desc: "기여자 추가 또는 업데이트"
    },
    "children_crossing": {
        emoji: "🚸",
        desc: "사용자 경험/사용성 개선"
    },
    "building_construction": {
        emoji: "🏗️",
        desc: "아키텍처 변경"
    },
    "iphone": {
        emoji: "📱",
        desc: "반응형 디자인 작업"
    },
    "clown_face": {
        emoji: "🤡",
        desc: "모킹"
    },
    "egg": {
        emoji: "🥚",
        desc: "이스터 에그 추가 또는 업데이트"
    },
    "see_no_evil": {
        emoji: "🙈",
        desc: ".gitignore 파일 추가 또는 업데이트"
    },
    "camera_flash": {
        emoji: "📸",
        desc: "스냅샷 추가 또는 업데이트"
    },
    "alembic": {
        emoji: "⚗️",
        desc: "실험 수행"
    },
    "mag": {
        emoji: "🔍️",
        desc: "SEO 개선"
    },
    "label": {
        emoji: "🏷️",
        desc: "유형 추가 또는 업데이트"
    },
    "seedling": {
        emoji: "🌱",
        desc: "시드 파일 추가 또는 업데이트"
    },
    "triangular_flag_on_post": {
        emoji: "🚩",
        desc: "기능 플래그 추가, 업데이트 또는 제거"
    },
    "goal_net": {
        emoji: "🥅",
        desc: "에러 처리"
    },
    "dizzy": {
        emoji: "💫",
        desc: "애니메이션 및 전환 추가 또는 업데이트"
    },
    "wastebasket": {
        emoji: "🗑️",
        desc: "정리가 필요한 코드 삭제"
    },
    "passport_control": {
        emoji: "🛂",
        desc: "권한, 역할 및 허가와 관련된 코드 작업"
    },
    "adhesive_bandage": {
        emoji: "🩹",
        desc: "비긴머 시리즈에 포함되지 않는 중요하지 않은 문제에 대한 간단한 수정"
    },
    "face_with_monocle": {
        emoji: "🧐",
        desc: "데이터 탐색/검사"
    },
    "test_tube": {
        emoji: "🧪",
        desc: "실패하는 테스트 추가"
    },
    "necktie": {
        emoji: "👔",
        desc: "비즈니스 로직 추가 또는 업데이트"
    },
    "stethoscope": {
        emoji: "🩺",
        desc: "헬스체크 추가 또는 업데이트"
    },
    "bricks": {
        emoji: "🧱",
        desc: "인프라 관련 변경"
    },
    "man_technologist": {
        emoji: "🧑‍💻",
        desc: "개발자 경험 개선"
    },
    "money_with_wings": {
        emoji: "💸",
        desc: "스폰서십 또는 금전 관련 인프라 추가"
    },
    "thread": {
        emoji: "🧵",
        desc: "멀티스레딩 또는 동시성과 관련된 코드 추가"
    },
};

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

// function splitObjectByIndex(obj, index) {
//     const keys = Object.keys(obj);
//     const chunkSize = Math.ceil(keys.length / index);

//     const result = [];
//     for (let i = 0; i < index; i++) {
//         const start = i * chunkSize;
//         const end = start + chunkSize;
//         const chunkKeys = keys.slice(start, end);
//         const chunkObj = chunkKeys.reduce((acc, key) => {
//             acc[key] = obj[key];
//             return acc;
//         }, {});
//         result.push(chunkObj);
//     };

//     if (index !== result.length) {
//         return result.slice(0, index);
//     };

//     return result;
// };

// function objectToText(obj) {
//     let text = "";
//     for (const key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             const emojiInfo = obj[key];

//             const name = String(key);
//             const emoji = String(emojiInfo.emoji);
//             const desc = String(emojiInfo.desc);

//             text += `이모지 이름: ${name}, 이모지: ${emoji}, 이모지 설명: ${desc} \n`;
//         }
//     }
//     return text;
// };

// const oftenEmojiListObjs = splitObjectByIndex(oftenEmojiList, 2);
// const emojiListObjs = splitObjectByIndex(emojiList, 3);

// const [oftenEmojiListObjOne, oftenEmojiListObjTwo] = oftenEmojiListObjs;
// const [emojiListObjOne, emojiListObjTwo, emojiListObjThree] = emojiListObjs;

// const oftenEmojiListObjOneText = objectToText(oftenEmojiListObjOne);
// const oftenEmojiListObjTwoText = objectToText(oftenEmojiListObjTwo);
// const emojiListObjOneText = objectToText(emojiListObjOne);
// const emojiListObjTwoText = objectToText(emojiListObjTwo);
// const emojiListObjThreeText = objectToText(emojiListObjThree);

// const runDataLearning = async _ => {
//     await session.prompt(oftenEmojiListObjOneText);
//     await session.prompt(oftenEmojiListObjTwoText);
//     await session.prompt(emojiListObjOneText);
//     await session.prompt(emojiListObjTwoText);
//     await session.prompt(emojiListObjThreeText);
// }

// runDataLearning();

io.on("connection", (socket) => {
    console.log("클라이언트가 연결되었습니다.");

    socket.on("send_message", async (msg  = "") => {

        const response = await session.prompt(msg);
        console.log(response);
        socket.emit("receive_message", `${response}`);
    });

    socket.on("disconnect", () => {
        console.log("클라이언트가 연결을 끊었습니다.");
    });
});

server.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
});