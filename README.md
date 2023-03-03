# Transmission React Web UI

I take free time to make this, so don't expect it to be finished anytime soon (or ever).

Right now if you want to use it you'll have to build it yourself specifying your RPC url:

```bash
git clone https://github.com/elboletaire/transmission-web-ui.git
cd transmission-web-ui
yarn
REACT_APP_RPC=/transmission/rpc PUBLIC_URL=/transmission/web yarn build
```

That will generate a `build` folder with the web app contents, which you can easily use if
you're using linuxserver's docker image:

```bash
docker run -d \
  -e TRANSMISSION_WEB_HOME=/webui \
  -v /path/to/transmission-web-ui/build:/webui \
  lscr.io/linuxserver/transmission:latest
```
