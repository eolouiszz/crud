chmod +x build.sh
./build.sh

se quiser rodar automaticamente apos o clone:

echo "./build.sh" > .git/hooks/post-checkout
chmod +x .git/hooks/post-checkout
