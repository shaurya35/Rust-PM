# apps/rust-be/Dockerfile
FROM rust:1.77 as builder

WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y openssl ca-certificates

WORKDIR /app
COPY --from=builder /app/target/release/rust-be /app/rust-be

# Create empty passwords.json if not exists
RUN touch /app/passwords.json

EXPOSE 8080
CMD ["/app/rust-be"]