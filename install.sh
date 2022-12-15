cd backend && npm install && echo 'DATABASE_URL="file:./dev.db"
QUIX_ACCESS_TOKEN=
QUIX_WORKSPACE_ID=
RAW_IMAGES_STREAM_ID=
PROCESSED_IMAGES_STREAM_ID=' > .env && npx prisma migrate dev --name init \
&& cd .. && cd frontend && npm install && \
cd .. && cd image-processor \
&& npm install && echo 'QUIX_ACCESS_TOKEN=
QUIX_WORKSPACE_ID=
RAW_IMAGES_STREAM_ID=
PROCESSED_IMAGES_STREAM_ID=' > .env && echo "setup completed" 