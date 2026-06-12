build:
	docker build -t amber-collect:snapshot .

run:
	docker run -p 3090:80 \
		-e AMBER_URL=http://localhost:3030 \
		-e RECAPTCHA_SITE_KEY='' \
		-e PATH_PREFIX='/' \
		amber-collect:snapshot

clean:
	docker rmi $(docker ps -a -q --filter ancestor=amber-collect:snapshot) || true
	docker rmi amber-collect:snapshot || true