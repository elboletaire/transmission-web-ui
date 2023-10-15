# Archived

See [TrguiNG] as a much better replacement.

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

If you currently have unrestricted access to your RPC (either because it's
unprotected or because you're on a LAN), you can try the
[uploaded version in github pages][pages].

[pages]: https://elboletaire.github.io/transmission-web-ui/
[TrguiNG]: https://github.com/openscopeproject/TrguiNG
