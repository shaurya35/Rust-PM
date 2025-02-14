# Build stage
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Final stage
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y openssl ca-certificates
WORKDIR /app
COPY --from=builder /app/target/release/rust-be /app/rust-be
COPY --from=builder /app/passwords.json /app/passwords.json

ENV PORT=8080
ENV ALLOWED_ORIGIN=https://your-vercel-app.vercel.app

EXPOSE 8080
CMD ["/app/rust-be"]