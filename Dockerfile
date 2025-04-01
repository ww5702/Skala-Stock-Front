# 1단계: 빌드용
FROM node:20-alpine AS builder

WORKDIR /app

# package.json과 환경 변수 파일 복사
COPY package*.json ./
COPY .env.production ./

# 의존성 설치
RUN npm install

# 전체 프로젝트 복사 (소스, public, src 등)
COPY . .

# Vite 빌드 (여기서 .env.production이 필요함!)
RUN npm run build

# 2단계: Nginx 사용해 정적 파일 서빙
FROM nginx:stable-alpine

# 빌드된 파일을 Nginx HTML 경로로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
